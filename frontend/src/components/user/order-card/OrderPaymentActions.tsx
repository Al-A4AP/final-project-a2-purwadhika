import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { CancelManualOrderAction } from "./CancelManualOrderAction";
import { MidtransWaitingNotice } from "./MidtransWaitingNotice";
import { UploadProofAction } from "./UploadProofAction";

type PaymentActionProps = Pick<OrderCardProps, "canceling" | "handleCancelClick" | "handleUploadClick" | "order" | "uploading">;

const canUploadProof = (props: Pick<OrderCardProps, "order">) =>
  props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MANUAL";

const isWaitingMidtrans = (props: Pick<OrderCardProps, "order">) =>
  props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MIDTRANS" && !props.order.midtrans_transaction_id;

export const OrderPaymentActions: FC<PaymentActionProps> = (props) => (
  <>
    {canUploadProof(props) && <UploadProofAction order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} />}
    {canUploadProof(props) && <CancelManualOrderAction order={props.order} canceling={props.canceling} handleCancelClick={props.handleCancelClick} />}
    {isWaitingMidtrans(props) && <MidtransWaitingNotice />}
  </>
);
