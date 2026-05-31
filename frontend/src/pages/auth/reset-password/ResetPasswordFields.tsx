import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ResetPasswordInput } from "@/validations/auth";
import { ResetPasswordField } from "./ResetPasswordField";

export const ResetPasswordFields: FC<{ form: UseFormReturn<ResetPasswordInput> }> = ({ form }) => (
  <>
    <ResetPasswordField register={form.register} name="password" label="Password Baru" placeholder="Minimal 8 karakter" error={form.formState.errors.password?.message} />
    <ResetPasswordField register={form.register} name="confirmPassword" label="Konfirmasi Password" placeholder="Ulangi password baru" error={form.formState.errors.confirmPassword?.message} />
  </>
);
