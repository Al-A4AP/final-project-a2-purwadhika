import type { FC } from "react";
import { CONTACT_INPUT_CLASS } from "./contactStyles";
import type { ContactFormData, ContactFormState } from "./contactTypes";

type TextInputFieldProps = { label: string; name: keyof ContactFormData; type: string; placeholder: string; state: ContactFormState };

export const TextInputField: FC<TextInputFieldProps> = ({ label, name, type, placeholder, state }) => (
  <div><label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">{label}</label><input type={type} required value={state.form[name]} onChange={(event) => state.updateField(name, event.target.value)} placeholder={placeholder} className={CONTACT_INPUT_CLASS} /></div>
);
