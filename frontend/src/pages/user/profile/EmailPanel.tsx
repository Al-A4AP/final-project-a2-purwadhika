import type { FC } from "react";
import type { useProfileActions } from "./useProfileActions";
import { EmailChangeForm } from "@/components/user/profile/EmailChangeForm";
import { profileInputClass } from "./profileStyles";

type ProfileState = ReturnType<typeof useProfileActions>;

export const EmailPanel: FC<{ state: ProfileState }> = ({ state }) => (
  <EmailChangeForm user={state.user} inputClass={profileInputClass} onRequest={state.requestEmailChange} />
);
