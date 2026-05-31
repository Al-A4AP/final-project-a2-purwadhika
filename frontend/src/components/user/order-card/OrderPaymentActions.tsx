import type { FC } from "react";
import type { OrderCardProps } from "./types";
import { MidtransWaitingNotice } from "./MidtransWaitingNotice";
import { UploadProofAction } from "./UploadProofAction";

const canUploadProof = (props: Pick<OrderCardProps, "order">) =>
  props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MANUAL";

const isWaitingMidtrans = (props: Pick<OrderCardProps, "order">) =>
  props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MIDTRANS" && !props.order.midtrans_transaction_id;

export const OrderPaymentActions: FC<Pick<OrderCardProps, "handleUploadClick" | "order" | "uploading">> = (props) => (
  <>
    {canUploadProof(props) && <UploadProofAction order={props.order} uploading={props.uploading} handleUploadClick={props.handleUploadClick} />}
    {isWaitingMidtrans(props) && <MidtransWaitingNotice />}
  </>
);
