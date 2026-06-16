import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { CancelOrderAction } from "./CancelOrderAction";
import { MidtransPaymentActions } from "./MidtransPaymentActions";
import { UploadProofAction } from "./UploadProofAction";

type PaymentActionProps = Pick<OrderCardProps, "canceling" | "handleCancelClick" | "handleUploadClick" | "order" | "paymentActionId" | "retryMidtransPayment" | "switchToManualPayment" | "uploading">;

const canUploadProof = (props: Pick<OrderCardProps, "order">) =>
  isOpenWaitingPayment(props.order) && props.order.payment_method === "MANUAL";

const canCancelOrder = (props: Pick<OrderCardProps, "order">) =>
  isOpenWaitingPayment(props.order) || (props.order.status === "WAITING_CONFIRMATION" && props.order.payment_method === "MANUAL");

const canManageMidtrans = (props: Pick<OrderCardProps, "order">) =>
  props.order.payment_method === "MIDTRANS" && isOpenWaitingPayment(props.order);

const isOpenWaitingPayment = (order: OrderCardProps["order"]) =>
  order.status === "WAITING_PAYMENT" && !isExpired(order.expires_at);

const isExpired = (expiresAt?: string) =>
  Boolean(expiresAt && new Date(expiresAt).getTime() <= Date.now());

export const OrderPaymentActions: FC<PaymentActionProps> = (props) => (
  <>
    {canUploadProof(props) && <UploadProofAction order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} />}
    {canCancelOrder(props) && <CancelOrderAction order={props.order} canceling={props.canceling} handleCancelClick={props.handleCancelClick} />}
    {canManageMidtrans(props) && <MidtransPaymentActions order={props.order} paymentActionId={props.paymentActionId} retryMidtransPayment={props.retryMidtransPayment} switchToManualPayment={props.switchToManualPayment} />}
  </>
);
