import type { UseFormReturn } from "react-hook-form";
import type { Role, User } from "@/types";
import type { TargetAuthRole } from "@/lib/authRole";
import type { RegisterInput } from "@/validations/auth";

export type RegisterPageProps = {
  targetRole?: TargetAuthRole;
};

export type RegisterPageState = {
  form: UseFormReturn<RegisterInput>;
  role?: TargetAuthRole;
  defaultRole: Role;
  registeredEmail: string | null;
  handleGoogleLogin: () => void;
  onSubmit: (data: RegisterInput) => Promise<void>;
};

export type SetUser = (user: User) => void;
