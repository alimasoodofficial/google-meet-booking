'use client';

import { motion } from 'framer-motion';
import { Video, Mail, User, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  start_time: string;
  end_time: string;
  meet_link: string;
}

export default function BookingsList({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active bookings</p>
        <p className="text-slate-500 mt-2 font-medium">When clients schedule meetings, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-shadow border-l-8 border-l-slate-200 hover:border-l-primary"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">{booking.client_name}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                  <Mail className="w-4 h-4" />
                  {booking.client_email}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:items-center bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 font-black text-slate-900">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {format(new Date(booking.start_time), 'PPP')}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
                <Clock className="w-4 h-4" />
                {format(new Date(booking.start_time), 'p')} — {format(new Date(booking.end_time), 'p')}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href={booking.meet_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary py-3 px-6 flex items-center gap-2 text-sm group"
              >
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Join Meeting
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
