import type { NavigateFunction } from "react-router-dom";
import { toast } from "react-hot-toast";

export const openSnapPayment = (token: string, navigate: NavigateFunction) => {
  window.snap.pay(token, {
    onSuccess: () => navigate("/payment/success"),
    onPending: () => navigate("/payment/success"),
    onError: () => { toast.error("Pembayaran gagal"); navigate("/orders"); },
    onClose: () => { toast("Anda menutup popup tanpa menyelesaikan pembayaran", { icon: "Warning" }); navigate("/orders"); },
  });
};
