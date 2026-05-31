import type { FC } from "react";
import { RegisterRoleSelect } from "./RegisterRoleSelect";
import { RegisterTextField } from "./RegisterTextField";
import type { RegisterPageState } from "./registerTypes";

export const RegisterFields: FC<{ state: RegisterPageState }> = ({ state }) => (
  <>
    <RegisterTextField label="Nama Lengkap" name="name" placeholder="Nama Anda" state={state} />
    <RegisterTextField label="Email" name="email" type="email" placeholder="email@contoh.com" state={state} />
    {!state.role && <RegisterRoleSelect state={state} />}
  </>
);
