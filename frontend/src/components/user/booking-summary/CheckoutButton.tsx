import type { FC } from "react";

interface CheckoutButtonProps {
  onCheckout: () => void;
  processing: boolean;
  totalPrice: number;
}

export const CheckoutButton: FC<CheckoutButtonProps> = ({ onCheckout, processing, totalPrice }) => (
  <button onClick={onCheckout} disabled={processing} className="w-full rounded-lg bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-70">
    {getButtonLabel(processing, totalPrice)}
  </button>
);

const getButtonLabel = (processing: boolean, totalPrice: number) => {
  if (processing) return "Memproses...";
  return totalPrice <= 0 ? "Konfirmasi Reservasi" : "Lanjutkan Pembayaran";
};
