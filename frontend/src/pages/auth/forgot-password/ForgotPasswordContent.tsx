import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordInput } from "@/validations/auth";
import { ForgotPasswordErrorNotice } from "./ForgotPasswordErrorNotice";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ForgotPasswordHeader } from "./ForgotPasswordHeader";
import { ForgotPasswordLoginLink } from "./ForgotPasswordLoginLink";

export const ForgotPasswordContent: FC<{ form: UseFormReturn<ForgotPasswordInput>; onSubmit: (data: ForgotPasswordInput) => void }> = ({ form, onSubmit }) => (
  <>
    <ForgotPasswordHeader />
    <ForgotPasswordErrorNotice message={form.formState.errors.root?.message} />
    <ForgotPasswordForm form={form} onSubmit={onSubmit} />
    <ForgotPasswordLoginLink />
  </>
);
