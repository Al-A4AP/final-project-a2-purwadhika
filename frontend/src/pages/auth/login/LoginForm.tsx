import type { FC } from "react";
import { Link } from "react-router-dom";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { EmailField, PasswordField } from "./LoginFields";
import { LoginDivider } from "./LoginDivider";
import { LoginSubmitButton } from "./LoginSubmitButton";
import type { LoginPageState } from "./loginTypes";

export const LoginForm: FC<{ state: LoginPageState }> = ({ state }) => (
  <form onSubmit={state.form.handleSubmit(state.onSubmit)} className="space-y-4">
    <EmailField state={state} />
    <PasswordField state={state} />
    <div className="flex justify-end"><Link to="/auth/forgot-password" className="text-sm text-red-600 hover:underline">Lupa password?</Link></div>
    <LoginSubmitButton isSubmitting={state.form.formState.isSubmitting} />
    <LoginDivider />
    <GoogleAuthButton label="Masuk dengan Google" onClick={() => state.handleGoogleLogin()} />
  </form>
);
