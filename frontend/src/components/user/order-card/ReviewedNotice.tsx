import type { FC } from "react";
import { Check } from "lucide-react";

export const ReviewedNotice: FC = () => (
  <p className="mt-2 flex items-center gap-1 text-xs text-green-600"><Check size={12} /> Sudah diulas</p>
);
