import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ResetPasswordInput } from "@/validations/auth";
import { ResetPasswordErrorNotice } from "./ResetPasswordErrorNotice";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { ResetPasswordHeader } from "./ResetPasswordHeader";
import { ResetPasswordLoginLink } from "./ResetPasswordLoginLink";

export const ResetPasswordContent: FC<{ form: UseFormReturn<ResetPasswordInput>; onSubmit: (data: ResetPasswordInput) => void }> = ({ form, onSubmit }) => (
  <>
    <ResetPasswordHeader />
    <ResetPasswordErrorNotice message={form.formState.errors.root?.message} />
    <ResetPasswordForm form={form} onSubmit={onSubmit} />
    <ResetPasswordLoginLink />
  </>
);
