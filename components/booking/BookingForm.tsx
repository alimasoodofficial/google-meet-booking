'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createBooking } from '@/app/actions/booking';
import { CheckCircle, Video, Loader2 } from 'lucide-react';

interface BookingFormProps {
  date: Date;
  time: string;
  onSuccess: (booking: any) => void;
}

export default function BookingForm({ date, time, onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(date);
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);

    const result = await createBooking({
      name,
      email,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    });

    if (result.success) {
      onSuccess(result.booking);
    } else {
      setError(result.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
      
      <h2 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">Confirm Booking</h2>
      
      <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 shadow-inner">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule Details</p>
          <p className="font-bold text-slate-900 text-lg">{date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="font-black text-primary text-xl">{time}</p>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">30-minute Google Meet session</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
          <input
            required
            name="name"
            type="text"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <input
            required
            name="email"
            type="email"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            placeholder="john@example.com"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-5 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Confirm & Schedule Meeting
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
