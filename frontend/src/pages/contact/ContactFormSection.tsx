import type { FC } from "react";
import { ContactForm } from "./ContactForm";
import { SubmittedNotice } from "./SubmittedNotice";
import type { ContactFormState } from "./contactTypes";

export const ContactFormSection: FC<{ state: ContactFormState }> = ({ state }) => (
  <div>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Tinggalkan Pesan</h2>
    {state.submitted && <SubmittedNotice />}
    <ContactForm state={state} />
  </div>
);
