import type { FC } from "react";
import { ExternalLink } from "lucide-react";

interface PaymentProofLinkProps {
  orderNumber: string;
  url: string;
}

export const PaymentProofLink: FC<PaymentProofLinkProps> = ({ orderNumber, url }) => (
  <a href={url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" aria-label={`Lihat bukti bayar ${orderNumber}`}>
    Lihat Bukti Pembayaran <ExternalLink size={12} />
  </a>
);
