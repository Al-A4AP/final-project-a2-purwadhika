import type { FC } from "react";
import { UploadCloud } from "lucide-react";
import { HelpText } from "@/components/common/HelpText";
import type { Order } from "@/types";

interface UploadProofActionProps {
  handleUploadClick: (id: string) => void;
  order: Order;
  uploading: string | null;
}

export const UploadProofAction: FC<UploadProofActionProps> = ({ handleUploadClick, order, uploading }) => (
  <div>
    <button onClick={() => handleUploadClick(order.id)} disabled={uploading === order.id} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
      {uploading === order.id ? "Mengunggah..." : <><UploadCloud size={16} /> Unggah Bukti Bayar</>}
    </button>
    <HelpText className="mt-2 max-w-xs">Unggah gambar bukti transfer yang jelas agar tenant bisa mengonfirmasi pesanan.</HelpText>
  </div>
);
