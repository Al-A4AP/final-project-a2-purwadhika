import type { FC } from "react";
import { Link } from "react-router-dom";

export const ForgotPasswordLoginLink: FC = () => (
  <p className="mt-6 text-center text-sm">
    <Link to="/auth/login" className="text-red-600 hover:underline">Kembali ke Login</Link>
  </p>
);
