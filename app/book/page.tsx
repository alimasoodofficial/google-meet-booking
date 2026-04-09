'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, Video, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import CalendarPicker from '@/components/booking/CalendarPicker';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingForm from '@/components/booking/BookingForm';
import { getAvailability } from '@/app/actions/availability';
import { getOccupiedSlots } from '@/app/actions/booking';
import BackButton from '@/components/BackButton';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [globalAvailability, setGlobalAvailability] = useState<any[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAvailability();
        setGlobalAvailability(data || []);
      } catch (e: any) {
        console.error('Booking Page Load Error:', e);
        setError('Connection error. Please check your Supabase configuration.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      async function loadOccupied() {
        const slots = await getOccupiedSlots(selectedDate!.toISOString());
        setOccupiedSlots(slots);
      }
      loadOccupied();
    }
  }, [selectedDate]);

  const availableDays = [...new Set(globalAvailability.map(a => a.day_of_week))];
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (date) setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSuccess = (booking: any) => {
    setBookingDetails(booking);
    setStep(4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Initializing Calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-10 text-center border-t-8 border-red-500">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Service Unavailable</h1>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            Try Refreshing
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col p-6">
      <div className="max-w-5xl w-full mx-auto">
        <div className="mb-12">
          <BackButton />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Book a Video Meeting</h1>
              <p className="text-slate-500 mb-12 max-w-lg mx-auto text-lg font-medium leading-relaxed">
                Select a date below to begin. We'll automatically secure a Google Meet link for your session.
              </p>
              <div className="flex justify-center">
                <div className="glass-card p-8 inline-block shadow-2xl">
                  <CalendarPicker 
                    selectedDate={selectedDate} 
                    onDateSelect={handleDateSelect}
                    availableDays={availableDays}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && selectedDate && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-3xl mx-auto"
            >
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-bold transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                Back to Calendar
              </button>
              
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Available Times</h1>
              <p className="text-slate-500 mb-12 text-lg font-semibold">
                Slots for <span className="text-primary">{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
              
              <div className="glass-card p-10 shadow-2xl">
                <TimeSlotPicker 
                  date={selectedDate}
                  availability={globalAvailability.filter(a => a.day_of_week === selectedDate.getDay())}
                  occupiedSlots={occupiedSlots}
                  selectedTime={selectedTime}
                  onSlotSelect={handleTimeSelect}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && selectedDate && selectedTime && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto"
            >
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-bold transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                Refine Time
              </button>
              
              <BookingForm 
                date={selectedDate} 
                time={selectedTime} 
                onSuccess={handleSuccess}
              />
            </motion.div>
          )}

          {step === 4 && bookingDetails && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center glass-card p-12 max-w-xl mx-auto border-t-8 border-primary shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12" />
              
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-3">Booking Confirmed!</h1>
              <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                Check your inbox. A Google Calendar invitation and meeting link have been dispatched.
              </p>
              
              <div className="bg-slate-50 p-8 rounded-2xl mb-10 text-left space-y-6 border border-slate-100 shadow-inner">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100"><CalendarIcon className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                    <p className="font-bold text-slate-900 text-lg">{new Date(bookingDetails.start_time).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100"><Video className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Meeting Link</p>
                    <a href={bookingDetails.meet_link} target="_blank" rel="noreferrer" className="font-bold text-primary break-all hover:text-blue-700 underline decoration-2 underline-offset-4">
                      {bookingDetails.meet_link}
                    </a>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="btn-primary w-full py-5 text-lg"
              >
                Schedule Another Meeting
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
