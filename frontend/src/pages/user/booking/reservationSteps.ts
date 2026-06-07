export interface ReservationStep {
  id: number;
  title: string;
}

export const buildReservationSteps = (isManual: boolean): ReservationStep[] => [
  { id: 1, title: "Detail Menginap" },
  { id: 2, title: "Data Tamu" },
  { id: 3, title: "Pembayaran" },
  ...(isManual ? [{ id: 4, title: "Bukti Transfer" }] : []),
  { id: isManual ? 5 : 4, title: "Tinjau Reservasi" },
];
