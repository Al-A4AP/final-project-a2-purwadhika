import type { FC } from "react";
import { RegisterFormContent } from "./RegisterFormContent";
import { RegisterSuccessPanel } from "./RegisterSuccessPanel";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

export const RegisterContent: FC<{ state: RegisterPageState }> = ({ state }) =>
  state.registeredEmail ? (
    <RegisterSuccessPanel email={state.registeredEmail} />
  ) : (
    <RegisterFormContent state={state} />
  );
