import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { EmailChangeInput } from "@/validations/profile";
import { ProfileTextField } from "./ProfileTextField";

export const EmailChangeFields: FC<{ form: UseFormReturn<EmailChangeInput>; inputClass: string }> = ({ form, inputClass }) => (
  <ProfileTextField label="Email Baru" inputClass={inputClass} placeholder="nama@email.com" registration={form.register("email")} error={form.formState.errors.email?.message} />
);
