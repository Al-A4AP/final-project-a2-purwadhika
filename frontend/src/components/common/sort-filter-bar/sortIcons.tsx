import type { ReactNode } from "react";
import { Banknote, BedDouble, Clock, Star, TrendingUp } from "lucide-react";
import type { SortIconKey } from "./sortFilterTypes";

export const SORT_ICON_MAP: Record<SortIconKey, ReactNode> = {
  trending: <TrendingUp size={13} />,
  star: <Star size={13} />,
  price: <Banknote size={13} />,
  clock: <Clock size={13} />,
  bed: <BedDouble size={13} />,
  alpha: <span className="text-xs font-bold leading-none">Az</span>,
};
