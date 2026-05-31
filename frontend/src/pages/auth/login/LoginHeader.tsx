import type { FC } from "react";
import { getRoleName } from "@/lib/authRole";
import type { LoginPageState } from "./loginTypes";

export const LoginHeader: FC<{ role: LoginPageState["role"] }> = ({ role }) => (
  <>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Masuk {getRoleName(role)}</h2>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Gunakan akun {getRoleName(role).toLowerCase()} Anda</p>
  </>
);
