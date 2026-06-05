import { Info } from "lucide-react";

export const PaymentConfirmationInfo = () => (
  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
        <Info size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-blue-900 dark:text-blue-300">Antrean Konfirmasi</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-blue-800 dark:text-blue-400/90">
          Halaman ini hanya menampilkan reservasi dengan status <strong>Menunggu Konfirmasi</strong>. Periksa bukti transfer yang diunggah tamu sebelum menerima pesanan.
        </p>
      </div>
    </div>
  </div>
);

