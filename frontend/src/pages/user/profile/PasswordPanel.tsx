import type { FC } from "react";
import type { useProfileActions } from "./useProfileActions";
import { PasswordChangeForm } from "@/components/user/profile/PasswordChangeForm";
import { PasswordUnavailableCard } from "@/components/user/profile/PasswordUnavailableCard";
import { profileInputClass } from "./profileStyles";

type ProfileState = ReturnType<typeof useProfileActions>;

export const PasswordPanel: FC<{ state: ProfileState }> = ({ state }) => (
  state.canChangePassword ? <PasswordChangeForm inputClass={profileInputClass} onSave={state.savePassword} /> : <PasswordUnavailableCard />
);
