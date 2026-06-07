import type { FC } from "react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { RegisterDivider } from "./RegisterDivider";
import { RegisterFields } from "./RegisterFields";
import { RegisterSubmitButton } from "./RegisterSubmitButton";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

export const RegisterForm: FC<{ state: RegisterPageState }> = ({ state }) => (
  <form onSubmit={state.form.handleSubmit(state.onSubmit)} className="space-y-4">
    <RegisterFields state={state} />
    <RegisterSubmitButton isSubmitting={state.form.formState.isSubmitting} />
    <RegisterDivider />
    <GoogleAuthButton label="Daftar dengan Google" onClick={() => state.handleGoogleLogin()} />
  </form>
);
