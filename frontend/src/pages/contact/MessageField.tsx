import type { FC } from "react";
import { CONTACT_INPUT_CLASS } from "./contactStyles";
import type { ContactFormState } from "./contactTypes";

export const MessageField: FC<{ state: ContactFormState }> = ({ state }) => (
  <div><label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Pesan Anda</label><textarea rows={6} required value={state.form.message} onChange={(event) => state.updateField("message", event.target.value)} placeholder="Tuliskan detail pertanyaan atau keluhan Anda di sini..." className={CONTACT_INPUT_CLASS} /></div>
);
