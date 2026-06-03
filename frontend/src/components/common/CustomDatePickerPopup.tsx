import { useState, useRef, useEffect, forwardRef } from 'react';
import { DayPicker } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import "react-day-picker/dist/style.css";

interface CustomDatePickerPopupProps {
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  className?: string;
  placeholder?: string;
  name?: string;
}

const formatDate = (date: Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

export const CustomDatePickerPopup = forwardRef<HTMLInputElement, CustomDatePickerPopupProps>(
  ({ value, onChange, min, className = '', placeholder = 'Pilih tanggal', name }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedDate = value ? new Date(`${value}T12:00:00Z`) : undefined;
    const minDate = min ? new Date(`${min}T00:00:00Z`) : undefined;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (date?: Date) => {
      if (date && onChange) {
        onChange(formatDate(date));
      }
      setIsOpen(false);
    };

    return (
      <div className="relative w-full" ref={containerRef}>
        <div
          className={`flex items-center justify-between cursor-pointer ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? '' : 'text-gray-400 dark:text-slate-500'}>
            {value || placeholder}
          </span>
          <CalendarIcon size={16} className="text-gray-400 dark:text-slate-500" />
        </div>

        {/* Hidden input to support form libraries like react-hook-form */}
        <input type="hidden" ref={ref} name={name} value={value || ''} />

        {isOpen && (
          <div className="absolute z-50 mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={minDate ? { before: minDate } : undefined}
              modifiersClassNames={{
                selected: 'bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:text-white dark:bg-red-600 dark:hover:bg-red-700',
                today: 'text-red-600 dark:text-red-400 font-semibold'
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

CustomDatePickerPopup.displayName = 'CustomDatePickerPopup';
