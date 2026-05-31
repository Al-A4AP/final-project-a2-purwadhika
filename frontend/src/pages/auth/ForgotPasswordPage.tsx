import type { FC } from "react";
import { ForgotPasswordContent } from "./forgot-password/ForgotPasswordContent";
import { ForgotPasswordSuccessPanel } from "./forgot-password/ForgotPasswordSuccessPanel";
import { useForgotPasswordState } from "./forgot-password/useForgotPasswordState";

const ForgotPasswordPage: FC = () => {
  const state = useForgotPasswordState();
  if (state.sent) return <ForgotPasswordSuccessPanel />;
  return <ForgotPasswordContent form={state.form} onSubmit={state.submit} />;
};

export default ForgotPasswordPage;
