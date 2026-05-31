import type { FC } from "react";
import { ResetPasswordContent } from "./reset-password/ResetPasswordContent";
import { ResetPasswordSuccessPanel } from "./reset-password/ResetPasswordSuccessPanel";
import { useResetPasswordPageState } from "./reset-password/useResetPasswordPageState";

const ResetPasswordPage: FC = () => {
  const state = useResetPasswordPageState();
  if (state.success) return <ResetPasswordSuccessPanel />;
  return <ResetPasswordContent form={state.form} onSubmit={state.submit} />;
};

export default ResetPasswordPage;
