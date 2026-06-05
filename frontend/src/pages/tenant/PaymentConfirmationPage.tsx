import { PaymentConfirmationContent } from "./payment-confirmation/PaymentConfirmationContent";
import { PaymentConfirmationHeader } from "./payment-confirmation/PaymentConfirmationHeader";
import { PaymentConfirmationInfo } from "./payment-confirmation/PaymentConfirmationInfo";
import { PaymentConfirmationModal } from "./payment-confirmation/PaymentConfirmationModal";
import { usePaymentConfirmationState } from "@/hooks/tenant/payment-confirmation/usePaymentConfirmationState";

export default function PaymentConfirmationPage() {
  const state = usePaymentConfirmationState();
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 pb-24 dark:bg-slate-900 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <PaymentConfirmationHeader />
        <PaymentConfirmationInfo />
        <PaymentConfirmationContent state={state} />
        <PaymentConfirmationModal state={state} />
      </div>
    </div>
  );
}
