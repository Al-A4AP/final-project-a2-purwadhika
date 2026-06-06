import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { appendMidtransScript, openSnapPayment, removeMidtransScript } from "@/lib/midtransSnap";
import { userOrderActionService } from "@/services/userOrderActionService";

export const useMidtransOrderActions = (refetch: () => void) => {
  const navigate = useNavigate();
  const [paymentActionId, setPaymentActionId] = useState<string | null>(null);
  useEffect(() => { const script = appendMidtransScript(); return () => removeMidtransScript(script); }, []);
  const retryMidtransPayment = useCallback((orderId: string) => {
    void runPaymentAction(orderId, setPaymentActionId, () => retryPayment(orderId, navigate, refetch));
  }, [navigate, refetch]);
  const switchToManualPayment = useCallback((orderId: string) => {
    void runPaymentAction(orderId, setPaymentActionId, () => switchPayment(orderId, refetch));
  }, [refetch]);
  return { paymentActionId, retryMidtransPayment, switchToManualPayment };
};

const retryPayment = async (orderId: string, navigate: ReturnType<typeof useNavigate>, refetch: () => void) => {
  const result = await userOrderActionService.retryMidtransPayment(orderId);
  refetch();
  if (result.snapToken) openSnapPayment(result.snapToken, navigate);
};

const switchPayment = async (orderId: string, refetch: () => void) => {
  await userOrderActionService.switchToManualPayment(orderId);
  toast.success("Metode pembayaran diubah ke manual transfer.");
  refetch();
};

const runPaymentAction = async (orderId: string, setBusy: (value: string | null) => void, action: () => Promise<void>) => {
  try { setBusy(orderId); await action(); }
  catch (err) { toast.error(getApiErrorMessage(err, "Aksi pembayaran belum berhasil diproses.")); }
  finally { setBusy(null); }
};
