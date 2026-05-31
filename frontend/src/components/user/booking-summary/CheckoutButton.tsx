import type { FC } from "react";

export const CheckoutButton: FC<{ onCheckout: () => void; processing: boolean }> = ({ onCheckout, processing }) => (
  <button onClick={onCheckout} disabled={processing} className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-70">
    {processing ? "Memproses..." : "Lanjutkan Pembayaran"}
  </button>
);
