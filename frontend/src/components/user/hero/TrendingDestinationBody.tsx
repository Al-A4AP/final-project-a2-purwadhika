import type { FC } from "react";
import { MapPin } from "lucide-react";
import type { TrendingDestinationData } from "./heroTypes";

type TrendingDestinationBodyProps = {
  destination: TrendingDestinationData;
};

export const TrendingDestinationBody: FC<TrendingDestinationBodyProps> = ({ destination }) => (
  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20">
    <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold tracking-widest uppercase mb-1">
      <MapPin size={10} /> {destination.count}
    </span>
    <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-red-200 transition">
      {destination.city}
    </h3>
  </div>
);
