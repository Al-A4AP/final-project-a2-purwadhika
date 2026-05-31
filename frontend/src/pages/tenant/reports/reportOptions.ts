export const REPORT_STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "WAITING_PAYMENT", label: "Menunggu Pembayaran" },
  { value: "WAITING_CONFIRMATION", label: "Menunggu Konfirmasi" },
  { value: "PROCESSED", label: "Dikonfirmasi" },
  { value: "COMPLETED", label: "Selesai Menginap" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

export const REPORT_SORT_OPTIONS = [
  { value: "created_at-desc", label: "Tanggal: Terbaru" },
  { value: "created_at-asc", label: "Tanggal: Terlama" },
  { value: "total_price-desc", label: "Nilai: Terbesar" },
  { value: "total_price-asc", label: "Nilai: Terkecil" },
];
