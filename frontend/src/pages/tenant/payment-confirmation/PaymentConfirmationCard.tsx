import type { Order } from "@/types";
import type { PaymentConfirmationState } from "./paymentConfirmationTypes";
import { PaymentConfirmationActions } from "./PaymentConfirmationActions";
import { PaymentConfirmationDetails } from "./PaymentConfirmationDetails";
import { PaymentProofPreview } from "./PaymentProofPreview";

export const PaymentConfirmationCard = ({ order, state }: PaymentConfirmationCardProps) => (
  <div className="flex flex-col gap-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row">
    <PaymentProofPreview order={order} />
    <div className="flex flex-1 flex-col justify-between space-y-6">
      <PaymentConfirmationDetails order={order} />
      <PaymentConfirmationActions order={order} state={state} />
    </div>
  </div>
);

interface PaymentConfirmationCardProps {
  order: Order;
  state: PaymentConfirmationState;
}

