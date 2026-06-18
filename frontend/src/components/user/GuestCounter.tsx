import type { FC } from 'react';
import { CounterStepper } from '@/components/common/CounterStepper';
import { MAX_ADULT_CAPACITY } from '@/constants/validation';

type GuestKey = 'adults' | 'children' | 'babies';

interface GuestType {
  key: GuestKey;
  label: string;
  desc: string;
}

const GUEST_TYPES: GuestType[] = [
  { key: 'adults', label: 'Dewasa', desc: 'Usia 13 tahun ke atas' },
  { key: 'children', label: 'Anak-anak', desc: 'Usia 2 - 12 tahun' },
  { key: 'babies', label: 'Bayi', desc: 'Di bawah 2 tahun' },
];

interface Props {
  guests: Record<GuestKey, number>;
  roomCapacity: number;
  onUpdate: (type: GuestKey, delta: number) => void;
}

export const GuestCounter: FC<Props> = (props) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Tamu</h2>
    <div className="space-y-4">
      {GUEST_TYPES.map((guestType) => <GuestCounterRow key={guestType.key} guestType={guestType} {...props} />)}
      <GuestSummary guests={props.guests} roomCapacity={props.roomCapacity} />
    </div>
  </div>
);

const GuestCounterRow: FC<Props & { guestType: GuestType }> = ({ guestType, guests, roomCapacity, onUpdate }) => (
  <div className="flex items-center justify-between">
    <GuestCopy guestType={guestType} />
    <CounterStepper decrementLabel={`Kurangi ${guestType.label}`} incrementLabel={`Tambah ${guestType.label}`}
      value={guests[guestType.key]} onDecrease={() => onUpdate(guestType.key, -1)} onIncrease={() => onUpdate(guestType.key, 1)}
      disableDecrease={isDecreaseDisabled(guestType.key, guests)} disableIncrease={isIncreaseDisabled(guestType.key, guests, roomCapacity)}
    />
  </div>
);

const GuestCopy: FC<{ guestType: GuestType }> = ({ guestType }) => (
  <div>
    <p className="font-medium text-gray-900 dark:text-white">{guestType.label}</p>
    <p className="text-xs text-gray-500">{guestType.desc}</p>
  </div>
);

const GuestSummary: FC<Pick<Props, 'guests' | 'roomCapacity'>> = ({ guests, roomCapacity }) => (
  <div className="text-xs text-gray-400 border-t dark:border-slate-700 pt-3 flex flex-col sm:flex-row justify-between gap-2">
    <span><strong>{guests.adults} Dewasa</strong>, {guests.children} Anak, {guests.babies} Bayi</span>
    <span className="text-gray-500">Kapasitas kamar: <strong>{roomCapacity} Dewasa</strong> (Maks. Anak & Bayi sesuai jumlah Dewasa)</span>
  </div>
);

const isDecreaseDisabled = (key: GuestKey, guests: Props['guests']) =>
  guests[key] <= (key === 'adults' ? 1 : 0);

const isIncreaseDisabled = (key: GuestKey, guests: Props['guests'], roomCapacity: number) =>
  (key === 'adults' && guests.adults >= Math.min(roomCapacity, MAX_ADULT_CAPACITY)) ||
  (key === 'children' && guests.children >= guests.adults) ||
  (key === 'babies' && guests.babies >= guests.adults);
