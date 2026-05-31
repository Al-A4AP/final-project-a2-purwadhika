import type { FC } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { REGISTER_SUBMIT_CLASS } from "./registerStyles";

export const RegisterSubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button type="submit" disabled={isSubmitting} className={REGISTER_SUBMIT_CLASS}>
    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
    {isSubmitting ? "Mendaftarkan..." : "Daftar"}
  </button>
);
