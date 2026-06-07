import type { UseFormReturn } from "react-hook-form";
import type { TargetAuthRole } from "@/lib/authRole";
import type { Role, User } from "@/types";
import type { RegisterInput } from "@/validations/auth";

export type RegisterPageProps = {
  targetRole?: TargetAuthRole;
};

export type RegisterPageState = {
  defaultRole: Role;
  form: UseFormReturn<RegisterInput>;
  handleGoogleLogin: () => void;
  onSubmit: (data: RegisterInput) => Promise<void>;
  registeredEmail: string | null;
  role?: TargetAuthRole;
};

export type SetUser = (user: User) => void;
