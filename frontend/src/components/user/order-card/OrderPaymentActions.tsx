import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { CancelManualOrderAction } from "./CancelManualOrderAction";
import { MidtransPaymentActions } from "./MidtransPaymentActions";
import { UploadProofAction } from "./UploadProofAction";

type PaymentActionProps = Pick<OrderCardProps, "canceling" | "handleCancelClick" | "handleUploadClick" | "order" | "paymentActionId" | "retryMidtransPayment" | "switchToManualPayment" | "uploading">;

const canUploadProof = (props: Pick<OrderCardProps, "order">) =>
  props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MANUAL";

const canManageMidtrans = (props: Pick<OrderCardProps, "order">) =>
  props.order.payment_method === "MIDTRANS" && ["WAITING_PAYMENT", "CANCELLED"].includes(props.order.status);

export const OrderPaymentActions: FC<PaymentActionProps> = (props) => (
  <>
    {canUploadProof(props) && <UploadProofAction order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} />}
    {canUploadProof(props) && <CancelManualOrderAction order={props.order} canceling={props.canceling} handleCancelClick={props.handleCancelClick} />}
    {canManageMidtrans(props) && <MidtransPaymentActions order={props.order} paymentActionId={props.paymentActionId} retryMidtransPayment={props.retryMidtransPayment} switchToManualPayment={props.switchToManualPayment} />}
  </>
);
