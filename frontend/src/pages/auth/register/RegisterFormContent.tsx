import type { FC } from "react";
import { RegisterErrorNotice } from "./RegisterErrorNotice";
import { RegisterForm } from "./RegisterForm";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterLoginLink } from "./RegisterLoginLink";
import type { RegisterPageState } from "./registerTypes";

export const RegisterFormContent: FC<{ state: RegisterPageState }> = ({ state }) => (
  <>
    <RegisterHeader role={state.defaultRole} />
    <RegisterErrorNotice state={state} />
    <RegisterForm state={state} />
    <RegisterLoginLink role={state.defaultRole} />
  </>
);
