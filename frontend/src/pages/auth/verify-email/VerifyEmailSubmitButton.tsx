import type { FC } from "react";
import { SUBMIT_BUTTON_CLASS } from "./verifyEmailStyles";

export const VerifyEmailSubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button type="submit" disabled={isSubmitting} className={SUBMIT_BUTTON_CLASS}>
    Verifikasi & Aktifkan Akun
  </button>
);
