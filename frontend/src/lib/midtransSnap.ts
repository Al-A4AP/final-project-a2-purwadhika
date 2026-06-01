import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";

const SNAP_SCRIPT_ID = "midtrans-snap-script";

export type SnapPaymentOptions = {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
};

declare global {
  interface Window {
    snap?: { pay: (token: string, options: SnapPaymentOptions) => void };
  }
}

export const appendMidtransScript = () => {
  if (document.getElementById(SNAP_SCRIPT_ID)) return null;
  const script = document.createElement("script");
  script.id = SNAP_SCRIPT_ID;
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
  document.body.appendChild(script);
  return script;
};

export const removeMidtransScript = (script: HTMLScriptElement | null) => {
  if (script?.parentElement) document.body.removeChild(script);
};

export const openSnapPayment = (token: string, navigate: NavigateFunction) => {
  if (!window.snap?.pay) return toast.error("Layanan pembayaran belum siap. Coba lagi sebentar.");
  window.snap.pay(token, {
    onSuccess: () => navigate("/payment/success"),
    onPending: () => navigate("/payment/success"),
    onError: () => { toast.error("Pembayaran gagal"); navigate("/orders"); },
    onClose: () => { toast("Anda menutup popup tanpa menyelesaikan pembayaran", { icon: "!" }); navigate("/orders"); },
  });
};
