import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ResetPasswordInput } from "@/validations/auth";
import { ResetPasswordFields } from "./ResetPasswordFields";
import { ResetPasswordSubmitButton } from "./ResetPasswordSubmitButton";

export const ResetPasswordForm: FC<{ form: UseFormReturn<ResetPasswordInput>; onSubmit: (data: ResetPasswordInput) => void }> = ({ form, onSubmit }) => (
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <ResetPasswordFields form={form} />
    <ResetPasswordSubmitButton isSubmitting={form.formState.isSubmitting} />
  </form>
);
