import type { FC } from "react";
import type { ContactInfoItem } from "./contactTypes";

export const ContactInfoCard: FC<{ item: ContactInfoItem }> = ({ item }) => {
  const Icon = item.icon;
  return <div className="flex flex-col"><Icon size={32} className="text-slate-900 dark:text-white mb-6" /><h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">{item.label}</h3><p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.value}</p><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p></div>;
};
