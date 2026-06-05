import { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
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
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  display?: 'popover' | 'inline';
}

const formatDate = (date: Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

export const CustomDatePickerPopup = forwardRef<HTMLInputElement, CustomDatePickerPopupProps>(
  ({ value, onChange, min, className = '', placeholder = 'Pilih tanggal', name, isOpen, onOpenChange, display = 'popover' }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const open = isOpen ?? internalOpen;
    const setOpen = useCallback((next: boolean) => {
      if (isOpen === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    }, [isOpen, onOpenChange]);

    const selectedDate = value ? new Date(`${value}T12:00:00Z`) : undefined;
    const minDate = min ? new Date(`${min}T00:00:00Z`) : undefined;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      if (open) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, setOpen]);

    const handleSelect = (date?: Date) => {
      if (date && onChange) {
        onChange(formatDate(date));
      }
      setOpen(false);
    };

    return (
      <div className="relative w-full" ref={containerRef}>
        <div
          className={`flex items-center justify-between cursor-pointer ${className}`}
          onClick={() => setOpen(!open)}
        >
          <span className={value ? '' : 'text-gray-400 dark:text-slate-500'}>
            {value || placeholder}
          </span>
          <CalendarIcon size={16} className="text-gray-400 dark:text-slate-500" />
        </div>

        {/* Hidden input to support form libraries like react-hook-form */}
        <input type="hidden" ref={ref} name={name} value={value || ''} />

        {open && <CalendarPanel display={display} minDate={minDate} selectedDate={selectedDate} onSelect={handleSelect} />}
      </div>
    );
  }
);

CustomDatePickerPopup.displayName = 'CustomDatePickerPopup';

const CalendarPanel = ({ display, minDate, onSelect, selectedDate }: CalendarPanelProps) => (
  <div className={panelClass(display)}>
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      disabled={minDate ? { before: minDate } : undefined}
      modifiersClassNames={DATE_PICKER_MODIFIERS}
    />
  </div>
);

const panelClass = (display: CustomDatePickerPopupProps['display']) =>
  display === 'inline'
    ? 'mt-2 w-fit max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800'
    : 'absolute z-50 mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800';

const DATE_PICKER_MODIFIERS = {
  selected: 'bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:text-white dark:bg-red-600 dark:hover:bg-red-700',
  today: 'text-red-600 dark:text-red-400 font-semibold',
};

interface CalendarPanelProps {
  display: CustomDatePickerPopupProps['display'];
  minDate?: Date;
  onSelect: (date?: Date) => void;
  selectedDate?: Date;
}
