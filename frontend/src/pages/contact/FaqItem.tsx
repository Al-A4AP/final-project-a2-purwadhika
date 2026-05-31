import type { FC } from "react";
import { Minus, Plus } from "lucide-react";
import type { FaqItemData, FaqState } from "./contactTypes";

type FaqItemProps = { faq: FaqItemData; index: number; state: FaqState };

const getPanelClass = (open: boolean) =>
  open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0";

export const FaqItem: FC<FaqItemProps> = ({ faq, index, state }) => {
  const open = state.openFaq === index;
  const Icon = open ? Minus : Plus;
  return <div className="border-b border-slate-200 dark:border-slate-800"><button type="button" onClick={() => state.toggleFaq(index)} className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"><span className="text-lg font-bold text-slate-900 dark:text-white pr-8 group-hover:text-rose-600 transition-colors">{faq.q}</span><span className="text-slate-400 shrink-0"><Icon size={20} /></span></button><div className={`overflow-hidden transition-all duration-300 ease-in-out ${getPanelClass(open)}`}><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p></div></div>;
};
