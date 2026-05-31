import type { UseFormReset } from "react-hook-form";
import type { PasswordInput } from "@/validations/profile";

export const submitPasswordChange = async (
  data: PasswordInput,
  onSave: (data: { old_password: string; new_password: string }) => Promise<void>,
  reset: UseFormReset<PasswordInput>,
) => {
  await onSave({ old_password: data.old_password, new_password: data.new_password });
  reset();
};
