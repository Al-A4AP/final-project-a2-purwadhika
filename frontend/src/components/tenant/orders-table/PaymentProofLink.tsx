import type { FC } from "react";
import { ExternalLink } from "lucide-react";

interface PaymentProofLinkProps {
  orderNumber: string;
  url: string;
}

export const PaymentProofLink: FC<PaymentProofLinkProps> = ({ orderNumber, url }) => (
  <a href={url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline" aria-label={`Lihat bukti bayar ${orderNumber}`}>
    Lihat Bukti <ExternalLink size={12} />
  </a>
);
