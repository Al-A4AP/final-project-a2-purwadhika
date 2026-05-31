import type { FC } from "react";

type TravelDateCardProps = {
  label: string;
  date: Date;
};

export const TravelDateCard: FC<TravelDateCardProps> = ({ label, date }) => (
  <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-semibold text-gray-900 dark:text-white">{date.toLocaleDateString("id-ID")}</p>
  </div>
);
