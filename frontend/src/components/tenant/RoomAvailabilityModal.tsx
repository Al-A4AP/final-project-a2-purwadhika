import type { FC } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface RoomAvailabilityModalProps {
  isOpen: boolean;
  blockedDays: Date[];
  onDayClick: (date: Date) => void;
  onClose: () => void;
}

export const RoomAvailabilityModal: FC<RoomAvailabilityModalProps> = ({
  isOpen,
  blockedDays,
  onDayClick,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Atur Ketersediaan Tanggal</h2>
        <p className="text-sm text-gray-500 mb-4">
          Klik pada tanggal untuk menandai sebagai <span className="text-red-500 font-bold">Tidak Tersedia</span> (ditandai dengan warna merah).
        </p>
        <div className="flex justify-center bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
          <DayPicker
            mode="multiple"
            selected={blockedDays}
            onDayClick={onDayClick}
            disabled={[{ before: new Date() }]}
            modifiers={{ blocked: blockedDays }}
            modifiersStyles={{
              blocked: { backgroundColor: '#ef4444', color: 'white' }
            }}
          />
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
