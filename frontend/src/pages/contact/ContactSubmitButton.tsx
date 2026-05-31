import type { FC } from "react";
import { Send } from "lucide-react";
import { CONTACT_SUBMIT_CLASS } from "./contactStyles";

export const ContactSubmitButton: FC = () => (
  <button type="submit" className={CONTACT_SUBMIT_CLASS}>
    Kirim Pesan Sekarang <Send size={18} />
  </button>
);
