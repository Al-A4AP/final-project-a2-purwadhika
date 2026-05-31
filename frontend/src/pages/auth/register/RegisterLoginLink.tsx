import type { FC } from "react";
import { Link } from "react-router-dom";
import { getRoleLoginPath } from "@/lib/authRole";
import type { Role } from "@/types";

export const RegisterLoginLink: FC<{ role: Role }> = ({ role }) => (
  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
    Sudah punya akun? <Link to={getRoleLoginPath(role)} className="text-red-600 font-semibold hover:underline">Masuk</Link>
  </p>
);
