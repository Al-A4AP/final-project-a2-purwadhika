import type { FC } from "react";
import { getRoleName } from "@/lib/authRole";
import type { Role } from "@/types";
import { RegisterBrandName } from "./RegisterBrandName";

export const RegisterHeader: FC<{ role: Role }> = ({ role }) => (
  <>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daftar Sebagai {getRoleName(role)}</h2>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Bergabung dengan <RegisterBrandName /></p>
  </>
);
