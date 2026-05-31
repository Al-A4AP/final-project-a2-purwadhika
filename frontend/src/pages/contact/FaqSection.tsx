import type { FC } from "react";
import { FAQS } from "./contactData";
import { FaqItem } from "./FaqItem";
import type { FaqState } from "./contactTypes";

export const FaqSection: FC<{ state: FaqState }> = ({ state }) => (
  <div>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Pertanyaan Umum (FAQ)</h2>
    <div className="space-y-2">{FAQS.map((faq, index) => <FaqItem key={faq.q} faq={faq} index={index} state={state} />)}</div>
  </div>
);
