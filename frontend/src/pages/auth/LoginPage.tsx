import type { FC } from "react";
import { LoginContent } from "./login/LoginContent";
import type { LoginPageProps } from "./login/loginTypes";
import { useLoginPageState } from "./login/useLoginPageState";

const LoginPage: FC<LoginPageProps> = ({ targetRole }) => (
  <LoginContent state={useLoginPageState(targetRole)} />
);

export default LoginPage;
