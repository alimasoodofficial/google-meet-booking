'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { motion } from 'framer-motion';

interface CalendarPickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  availableDays: number[]; // 0-6
}

export default function CalendarPicker({ selectedDate, onDateSelect, availableDays }: CalendarPickerProps) {
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Only enable days that are in availableDays
    return !availableDays.includes(date.getDay());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl inline-block"
    >
      <style>{`
        .rdp {
          --rdp-cell-size: 45px;
          --rdp-accent-color: #0836C1;
          --rdp-background-color: #e6ebf9;
          margin: 0;
        }
        .rdp-day_selected {
          background-color: var(--rdp-accent-color) !important;
          font-weight: bold;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: var(--rdp-background-color) !important;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={isDateDisabled}
        showOutsideDays
      />
    </motion.div>
  );
}
