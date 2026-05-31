import type { FC } from "react";
import { VerifyEmailHeader } from "./VerifyEmailHeader";
import { VerifyEmailSubmitButton } from "./VerifyEmailSubmitButton";
import { VerifyPasswordFields } from "./VerifyPasswordFields";
import type { VerifyEmailPageState } from "./verifyEmailTypes";

export const VerifyEmailForm: FC<{ state: VerifyEmailPageState }> = ({ state }) => (
  <>
    <VerifyEmailHeader />
    <form onSubmit={state.form.handleSubmit(state.onSubmit)} className="space-y-4">
      <VerifyPasswordFields state={state} />
      <VerifyEmailSubmitButton isSubmitting={state.form.formState.isSubmitting} />
    </form>
  </>
);
