import type { PaymentConfirmationState } from "./paymentConfirmationTypes";
import { PaymentConfirmationCard } from "./PaymentConfirmationCard";

export const PaymentConfirmationList = ({ state }: { state: PaymentConfirmationState }) => (
  <div className="grid grid-cols-1 gap-6">
    {state.orders.map((order) => (
      <PaymentConfirmationCard key={order.id} order={order} state={state} />
    ))}
  </div>
);

