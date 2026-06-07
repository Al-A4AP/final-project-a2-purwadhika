import type { FC } from "react";
import { Link } from "react-router-dom";
import { getRoleRegisterPath } from "@/lib/authRole";
import type { LoginPageState } from "@/hooks/auth/login/loginTypes";

export const LoginRegisterLink: FC<{ role: LoginPageState["role"] }> = ({ role }) => (
  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
    Belum punya akun? <Link to={getRoleRegisterPath(role)} className="text-red-600 font-semibold hover:underline">Daftar sekarang</Link>
  </p>
);
