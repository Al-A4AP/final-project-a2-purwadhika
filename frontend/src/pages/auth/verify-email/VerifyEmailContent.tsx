import type { FC } from "react";
import { ErrorPanel } from "./VerifyEmailPanels";
import { LoadingPanel } from "./VerifyEmailPanels";
import { SuccessPanel } from "./VerifyEmailPanels";
import { VerifyEmailForm } from "./VerifyEmailForm";
import type { VerifyEmailPageState } from "@/hooks/auth/verify-email/verifyEmailTypes";

export const VerifyEmailContent: FC<{ state: VerifyEmailPageState }> = ({ state }) => (
  <div className="max-w-md mx-auto py-6">
    {state.status === "form" && <VerifyEmailForm state={state} />}
    {state.status === "loading" && <LoadingPanel />}
    {state.status === "success" && <SuccessPanel />}
    {state.status === "error" && <ErrorPanel state={state} />}
  </div>
);
