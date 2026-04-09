'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { createGoogleMeetEvent } from '@/lib/google-calendar';
import { sendBookingConfirmation } from '@/lib/mail';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function createBooking(formData: {
  name: string;
  email: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
}) {
  const supabase = getSupabaseAdmin();
  const { name, email, startTime, endTime } = formData;

  // 1. Verify slot is still available
  const { data: existingBooking } = await supabase
    .from('bookings')
    .select('id')
    .eq('start_time', startTime)
    .single();

  if (existingBooking) {
    return { error: 'This time slot is already booked.' };
  }

  try {
    // 2. Create Google Calendar Event with Meet Link
    const googleEvent = await createGoogleMeetEvent({
      title: `Meeting with ${name}`,
      description: `Booking from website for ${name} (${email})`,
      startTime,
      endTime,
      attendeeEmail: email,
    });

    const meetLink = googleEvent.hangoutLink;
    const googleEventId = googleEvent.id;

    // 3. Save to Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert({
        client_name: name,
        client_email: email,
        start_time: startTime,
        end_time: endTime,
        meet_link: meetLink,
        google_event_id: googleEventId,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // 4. Send Confirmation Email via Nodemailer
    const startObj = new Date(startTime);
    await sendBookingConfirmation({
        to: email,
        name,
        date: startObj.toDateString(),
        time: startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meetLink: meetLink || ''
    });

    revalidatePath('/admin/dashboard');
    return { success: true, booking };
  } catch (error: any) {
    console.error('Booking error:', error);
    
    // Better error messages for Google Auth issues
    if (error.message?.includes('invalid_client')) {
      return { 
        error: 'Google API Configuration Error: The Client ID or Client Secret is invalid. Please check your credentials in .env.local.' 
      };
    }
    if (error.message?.includes('invalid_grant')) {
        return { 
          error: 'Google API Refresh Token expired or invalid. Please re-authenticate and update GOOGLE_REFRESH_TOKEN.' 
        };
    }

    return { error: error.message || 'Failed to create booking.' };
  }
}

export async function getOccupiedSlots(date: string) {
    const supabase = getSupabaseAdmin();
    // Fetch bookings for the specific day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from('bookings')
        .select('start_time')
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());

    if (error) return [];
    return data.map(b => new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
}
