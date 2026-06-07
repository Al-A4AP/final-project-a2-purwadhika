import type { FC } from "react";
import { VerifyPasswordField } from "./VerifyPasswordField";
import type { VerifyEmailPageState } from "@/hooks/auth/verify-email/verifyEmailTypes";

export const VerifyPasswordFields: FC<{ state: VerifyEmailPageState }> = ({ state }) => {
  const errors = state.form.formState.errors;
  return (
    <>
      <VerifyPasswordField label="Password Baru" name="password" placeholder="Minimal 8 karakter" visible={state.showPassword} onToggle={state.togglePassword} error={errors.password?.message} register={state.form.register} />
      <VerifyPasswordField label="Konfirmasi Password" name="confirmPassword" placeholder="Ulangi password baru" visible={state.showConfirmPassword} onToggle={state.toggleConfirmPassword} error={errors.confirmPassword?.message} register={state.form.register} />
    </>
  );
};
