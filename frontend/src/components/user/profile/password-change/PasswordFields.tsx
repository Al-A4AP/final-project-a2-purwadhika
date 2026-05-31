import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PasswordInput } from "@/validations/profile";
import { ProfileTextField } from "../ProfileTextField";
import { SecurePasswordField } from "./SecurePasswordField";
import { usePasswordVisibility } from "./usePasswordVisibility";

export const PasswordFields: FC<{ form: UseFormReturn<PasswordInput>; inputClass: string }> = ({ form, inputClass }) => {
  const visibility = usePasswordVisibility();
  return (
    <>
      <ProfileTextField type="password" label="Password Lama" inputClass={inputClass} placeholder="Minimal 8 karakter" registration={form.register("old_password")} error={form.formState.errors.old_password?.message} />
      <SecurePasswordField label="Password Baru" name="new_password" inputClass={inputClass} register={form.register} error={form.formState.errors.new_password?.message} isVisible={visibility.showNewPassword} onToggle={visibility.toggleNewPassword} />
      <SecurePasswordField label="Konfirmasi Password Baru" name="confirm_password" inputClass={inputClass} register={form.register} error={form.formState.errors.confirm_password?.message} isVisible={visibility.showConfirmPassword} onToggle={visibility.toggleConfirmPassword} />
    </>
  );
};
