import type { FC } from "react";
import { Send, Loader2 } from "lucide-react";
import { CONTACT_SUBMIT_CLASS } from "./contactStyles";

export const ContactSubmitButton: FC<{ loading?: boolean }> = ({ loading }) => (
  <button type="submit" disabled={loading} className={`${CONTACT_SUBMIT_CLASS} disabled:opacity-70 disabled:cursor-not-allowed`}>
    {loading ? "Mengirim..." : "Kirim Pesan Sekarang"}
    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
  </button>
);
