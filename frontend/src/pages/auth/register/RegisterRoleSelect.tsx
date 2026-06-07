import type { FC } from "react";
import { REGISTER_INPUT_CLASS } from "./registerStyles";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

export const RegisterRoleSelect: FC<{ state: RegisterPageState }> = ({ state }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daftar sebagai</label>
    <select {...state.form.register("role")} className={REGISTER_INPUT_CLASS}>
      <option value="USER">Penyewa (Pencari Properti)</option>
      <option value="TENANT">Pemilik Properti (Tenant)</option>
    </select>
  </div>
);
