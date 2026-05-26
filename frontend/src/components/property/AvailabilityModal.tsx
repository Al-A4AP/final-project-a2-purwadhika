import type { FC } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Props {
  isOpen: boolean;
  roomName: string;
  blockedDays: Date[];
  onClose: () => void;
}

export const AvailabilityModal: FC<Props> = ({ isOpen, roomName, blockedDays, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Ketersediaan Kamar</h2>
        <p className="text-sm text-gray-500 mb-4">{roomName}</p>
        <div className="flex justify-center bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
          <DayPicker
            disabled={[{ before: new Date() }, ...blockedDays]}
            modifiers={{ blocked: blockedDays }}
            modifiersStyles={{
              blocked: { backgroundColor: '#ef4444', color: 'white', textDecoration: 'line-through' },
            }}
          />
        </div>
        <p className="text-xs text-center text-red-500 mt-2">Tanggal yang dicoret berarti penuh/tidak tersedia.</p>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
