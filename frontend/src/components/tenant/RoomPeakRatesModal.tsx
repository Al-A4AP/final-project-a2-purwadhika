import type { FC } from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';
import type { PeakSeasonRate } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface RoomPeakRatesModalProps {
  isOpen: boolean;
  peakRates: PeakSeasonRate[];
  peakForm: {
    start_date: string;
    end_date: string;
    rate_type: string;
    rate_value: string;
    description: string;
  };
  onFormChange: (form: {
    start_date: string;
    end_date: string;
    rate_type: string;
    rate_value: string;
    description: string;
  }) => void;
  onAddRate: (e: React.FormEvent) => void;
  onDeleteRate: (id: string) => void;
  onClose: () => void;
}

export const RoomPeakRatesModal: FC<RoomPeakRatesModalProps> = ({
  isOpen,
  peakRates,
  peakForm,
  onFormChange,
  onAddRate,
  onDeleteRate,
  onClose,
}) => {
  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2 border dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full p-6 space-y-6 shadow-xl border dark:border-slate-700">
        <div className="flex justify-between items-center pb-3 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-orange-500" />
            Kelola Peak Season
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-bold text-lg">&times;</button>
        </div>

        {/* List of current Peak Rates */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Peak Season Aktif ({peakRates.length})</h3>
          {peakRates.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">Belum ada peak season yang diatur untuk kamar ini.</p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {peakRates.map((rate) => (
                <div key={rate.id} className="flex justify-between items-center text-xs bg-orange-50 dark:bg-orange-950/15 p-2.5 rounded border border-orange-100 dark:border-orange-950/30">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{rate.description || 'Peak Season Rate'}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                      {new Date(rate.start_date).toLocaleDateString('id-ID')} - {new Date(rate.end_date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      {rate.rate_type === 'PERCENTAGE' ? `+${rate.rate_value}%` : `+${formatPrice(rate.rate_value)}`}
                    </span>
                    <button onClick={() => onDeleteRate(rate.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition" title="Hapus Aturan">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form to Add New Peak Rate */}
        <form onSubmit={onAddRate} className="border-t dark:border-slate-700 pt-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-305">Tambah Aturan Peak Season Baru</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={peakForm.start_date}
                onChange={(e) => onFormChange({ ...peakForm, start_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                required
                value={peakForm.end_date}
                min={peakForm.start_date}
                onChange={(e) => onFormChange({ ...peakForm, end_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Tipe Penyesuaian</label>
              <select
                value={peakForm.rate_type}
                onChange={(e) => onFormChange({ ...peakForm, rate_type: e.target.value })}
                className={inputClass}
              >
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="NOMINAL">Nominal Rupiah (Rp)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nilai Tambahan</label>
              <input
                type="number"
                min="0"
                required
                placeholder={peakForm.rate_type === 'PERCENTAGE' ? '10' : '100000'}
                value={peakForm.rate_value}
                onChange={(e) => onFormChange({ ...peakForm, rate_value: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">Nama/Deskripsi (opsional)</label>
              <input
                type="text"
                placeholder="cth. Libur Lebaran, Tahun Baru"
                value={peakForm.description}
                onChange={(e) => onFormChange({ ...peakForm, description: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-semibold transition shadow-md">
            Simpan Aturan Peak Season
          </button>
        </form>

        <div className="flex justify-end pt-2 border-t dark:border-slate-700">
          <button onClick={onClose} className="bg-gray-150 hover:bg-gray-250 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white text-gray-800 px-4 py-2 rounded-lg font-medium transition text-xs">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
