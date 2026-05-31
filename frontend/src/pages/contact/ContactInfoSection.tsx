import type { FC } from "react";
import { CONTACT_INFO } from "./contactData";
import { ContactInfoCard } from "./ContactInfoCard";

export const ContactInfoSection: FC = () => (
  <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {CONTACT_INFO.map((item) => <ContactInfoCard key={item.label} item={item} />)}
    </div>
  </section>
);
