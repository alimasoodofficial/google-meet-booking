'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { updateAvailability } from '@/app/actions/availability';

const DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

interface Slot {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export default function AvailabilitySetter({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots.length > 0 ? initialSlots : [
    { day_of_week: 1, start_time: '09:00', end_time: '17:00' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addSlot = () => {
    setSlots([...slots, { day_of_week: 1, start_time: '09:00', end_time: '17:00' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, updates: Partial<Slot>) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    setSlots(newSlots);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAvailability(slots);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
        console.error(error);
      alert('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Recurring Availability
          </h3>
          <p className="text-slate-500 font-medium text-sm mt-1">Define your weekly standard working hours.</p>
        </div>
        <button 
          onClick={addSlot}
          className="btn-secondary py-3 px-6 flex items-center gap-2 group active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add New Slot
        </button>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode='popLayout'>
          {slots.map((slot, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 flex flex-wrap items-center gap-8 border-l-8 border-l-primary hover:shadow-lg transition-shadow"
            >
              <div className="flex-1 min-w-[200px]">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Active Day</label>
                <select 
                  value={slot.day_of_week}
                  onChange={(e) => updateSlot(index, { day_of_week: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
                >
                  {DAYS.map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Start Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="time" 
                      value={slot.start_time.substring(0, 5)}
                      onChange={(e) => updateSlot(index, { start_time: e.target.value })}
                      className="bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-md font-black border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div className="mt-6 font-black text-slate-300">TO</div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">End Time</label>
                  <div className="relative group">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="time" 
                      value={slot.end_time.substring(0, 5)}
                      onChange={(e) => updateSlot(index, { end_time: e.target.value })}
                      className="bg-slate-50 pl-10 pr-4 py-3 rounded-xl text-md font-black border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => removeSlot(index)}
                className="mt-6 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                title="Remove Slot"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-6 flex items-center gap-6 sticky bottom-0 bg-[#f8fafc]/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-xl">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="btn-primary py-4 px-10 flex items-center gap-3 disabled:opacity-50 min-w-[200px]"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Save Availability</>}
        </button>
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl border border-emerald-100 font-bold flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Configuration Synchronized
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
