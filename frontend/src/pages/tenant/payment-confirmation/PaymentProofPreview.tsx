import { ExternalLink } from "lucide-react";
import type { Order } from "@/types";

export const PaymentProofPreview = ({ order }: { order: Order }) => (
  <div className="w-full shrink-0 lg:w-1/3">
    <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Bukti Transfer</p>
    <div className="group relative flex aspect-3/4 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
      {order.payment_proof_url ? <ProofImage order={order} /> : <p className="text-sm text-slate-400">Bukti tidak tersedia</p>}
    </div>
  </div>
);

const ProofImage = ({ order }: { order: Order }) => (
  <>
    <img src={order.payment_proof_url || ""} alt={`Bukti ${order.order_number}`} className="h-full w-full object-contain" />
    <a href={order.payment_proof_url || ""} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/60 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
      <ExternalLink size={16} /> Lihat Penuh
    </a>
  </>
);

