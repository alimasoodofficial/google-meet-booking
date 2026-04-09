'use server';

import { getSupabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getAvailability() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateAvailability(availability: { day_of_week: number, start_time: string, end_time: string }[]) {
  const supabase = getSupabaseAdmin();
  
  // Clear existing and insert new (simple approach for MVP)
  const { error: deleteError } = await supabase
    .from('availability')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Hack to delete all

  if (deleteError) throw deleteError;

  const { error: insertError } = await supabase
    .from('availability')
    .insert(availability);

  if (insertError) throw insertError;

  revalidatePath('/admin/dashboard');
  revalidatePath('/book');
  return { success: true };
}

export async function getBookings() {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_time', { ascending: false });
  
    if (error) throw error;
    return data;
  }
