export interface ReservationStep {
  id: number;
  title: string;
}

export const buildReservationSteps = (isManual: boolean): ReservationStep[] => [
  { id: 1, title: "Detail Menginap" },
  { id: 2, title: "Data Tamu" },
  { id: 3, title: "Persetujuan" },
  { id: 4, title: "Pembayaran" },
  ...(isManual ? [{ id: 5, title: "Bukti Transfer" }] : []),
  { id: isManual ? 6 : 5, title: "Tinjau Reservasi" },
];
