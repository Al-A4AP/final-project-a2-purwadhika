import type { FC } from "react";
import { VerifyEmailContent } from "./verify-email/VerifyEmailContent";
import { useVerifyEmailPageState } from "../../hooks/auth/verify-email/useVerifyEmailPageState";

const VerifyEmailPage: FC = () => <VerifyEmailContent state={useVerifyEmailPageState()} />;

export default VerifyEmailPage;
