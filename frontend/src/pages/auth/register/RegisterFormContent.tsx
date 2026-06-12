import type { FC } from "react";
import { RegisterErrorNotice } from "./RegisterErrorNotice";
import { RegisterForm } from "./RegisterForm";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterLoginLink } from "./RegisterLoginLink";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";
import { useWatch } from "react-hook-form";

export const RegisterFormContent: FC<{ state: RegisterPageState }> = ({
  state,
}) => {
  const selectedRole =
    useWatch({ control: state.form.control, name: "role" }) ??
    state.defaultRole;
  return (
    <>
      <RegisterHeader role={selectedRole} />
      <RegisterErrorNotice state={state} />
      <RegisterForm state={state} />
      <RegisterLoginLink role={state.defaultRole} />
    </>
  );
};
