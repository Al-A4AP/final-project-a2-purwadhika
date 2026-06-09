import type { FC } from "react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { RegisterDivider } from "./RegisterDivider";
import { RegisterFields } from "./RegisterFields";
import { RegisterSubmitButton } from "./RegisterSubmitButton";
import type { RegisterPageState } from "@/hooks/auth/register/registerTypes";

export const RegisterForm: FC<{ state: RegisterPageState }> = ({ state }) => (
  <form onSubmit={state.form.handleSubmit(state.onSubmit)} className="space-y-4">
    {state.form.formState.errors.root && (
      <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800/50">
        {state.form.formState.errors.root.message}
      </div>
    )}
    <RegisterFields state={state} />
    <RegisterSubmitButton isSubmitting={state.form.formState.isSubmitting} />
    <RegisterDivider />
    <GoogleAuthButton label="Daftar dengan Google" onClick={() => state.handleGoogleLogin()} />
  </form>
);
