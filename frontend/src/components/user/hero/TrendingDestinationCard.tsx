import type { FC } from "react";
import { TrendingDestinationBody } from "./TrendingDestinationBody";
import type { TrendingDestinationData } from "./heroTypes";

type TrendingDestinationCardProps = {
  destination: TrendingDestinationData;
  onSelectCity: (city: string) => void;
};

export const TrendingDestinationCard: FC<TrendingDestinationCardProps> = ({ destination, onSelectCity }) => (
  <button onClick={() => onSelectCity(destination.city)} className="group relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md text-left transition duration-300 hover:shadow-xl hover:-translate-y-1 outline-none focus:ring-2 focus:ring-red-500">
    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/90" />
    <img src={destination.image} alt={destination.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    <TrendingDestinationBody destination={destination} />
  </button>
);
