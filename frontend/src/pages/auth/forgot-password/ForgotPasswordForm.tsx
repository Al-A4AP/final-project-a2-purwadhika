import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordInput } from "@/validations/auth";
import { ForgotEmailField } from "./ForgotEmailField";
import { ForgotPasswordSubmitButton } from "./ForgotPasswordSubmitButton";

export const ForgotPasswordForm: FC<{ form: UseFormReturn<ForgotPasswordInput>; onSubmit: (data: ForgotPasswordInput) => void }> = ({ form, onSubmit }) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <ForgotEmailField register={form.register} error={form.formState.errors.email?.message} />
    <ForgotPasswordSubmitButton isSubmitting={form.formState.isSubmitting} />
  </form>
);
