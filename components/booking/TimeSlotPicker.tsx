'use client';

import { motion } from 'framer-motion';
import { format, addMinutes, parse, isBefore, isAfter, startOfDay, isEqual } from 'date-fns';

interface TimeSlotPickerProps {
  date: Date;
  availability: { start_time: string, end_time: string }[];
  occupiedSlots: string[]; // ['09:00', '10:30']
  onSlotSelect: (time: string) => void;
  selectedTime: string | null;
}

export default function TimeSlotPicker({ date, availability, occupiedSlots, onSlotSelect, selectedTime }: TimeSlotPickerProps) {
  const generateSlots = () => {
    const slots: string[] = [];
    
    availability.forEach(avail => {
      let current = parse(avail.start_time.substring(0, 5), 'HH:mm', date);
      const end = parse(avail.end_time.substring(0, 5), 'HH:mm', date);

      while (isBefore(current, end)) {
        const timeStr = format(current, 'HH:mm');
        
        // Don't show slots in the past for today
        const now = new Date();
        if (isBefore(current, now)) {
            current = addMinutes(current, 30);
            continue;
        }

        if (!occupiedSlots.includes(timeStr)) {
          slots.push(timeStr);
        }
        current = addMinutes(current, 30);
      }
    });

    return slots.sort();
  };

  const slots = generateSlots();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.length > 0 ? (
        slots.map((time, index) => (
          <motion.button
            key={time}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSlotSelect(time)}
            className={`p-3 rounded-xl border text-sm font-medium transition-all ${
              selectedTime === time 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {time}
          </motion.button>
        ))
      ) : (
        <p className="col-span-full text-center py-8 text-gray-500 glass-card rounded-xl">
          No slots available for this day.
        </p>
      )}
    </div>
  );
}
