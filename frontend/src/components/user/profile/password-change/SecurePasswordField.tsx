import type { FC } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { PasswordInput } from "@/validations/profile";
import { PasswordVisibilityButton } from "./PasswordVisibilityButton";

interface SecurePasswordFieldProps {
  error?: string;
  inputClass: string;
  isVisible: boolean;
  label: string;
  name: "new_password" | "confirm_password";
  onToggle: () => void;
  register: UseFormRegister<PasswordInput>;
}

export const SecurePasswordField: FC<SecurePasswordFieldProps> = (props) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{props.label}</label>
    <div className="relative">
      <input type={props.isVisible ? "text" : "password"} {...props.register(props.name)} placeholder="Minimal 8 karakter" className={props.inputClass} />
      <PasswordVisibilityButton isVisible={props.isVisible} onToggle={props.onToggle} />
    </div>
    {props.error && <p className="mt-1 text-xs text-red-500">{props.error}</p>}
  </div>
);
