import type { FC } from "react";
import { RegisterContent } from "./register/RegisterContent";
import type { RegisterPageProps } from "./register/registerTypes";
import { useRegisterPageState } from "../../hooks/auth/register/useRegisterPageState";

const RegisterPage: FC<RegisterPageProps> = ({ targetRole }) => (
  <RegisterContent state={useRegisterPageState(targetRole)} />
);

export default RegisterPage;
