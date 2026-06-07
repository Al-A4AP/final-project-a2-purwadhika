import type { FC } from "react";
import { LoginErrorNotice } from "./LoginErrorNotice";
import { LoginForm } from "./LoginForm";
import { LoginHeader } from "./LoginHeader";
import { LoginRegisterLink } from "./LoginRegisterLink";
import type { LoginPageState } from "@/hooks/auth/login/loginTypes";

export const LoginContent: FC<{ state: LoginPageState }> = ({ state }) => (
  <>
    <LoginHeader role={state.role} />
    <LoginErrorNotice state={state} />
    <LoginForm state={state} />
    <LoginRegisterLink role={state.role} />
  </>
);
