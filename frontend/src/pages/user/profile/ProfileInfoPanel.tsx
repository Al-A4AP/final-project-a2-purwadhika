import type { FC } from "react";
import type { useProfileActions } from "@/hooks/user/profile/useProfileActions";
import { ProfileInfoForm } from "@/components/user/profile/ProfileInfoForm";
import { profileInputClass } from "./profileStyles";

type ProfileState = ReturnType<typeof useProfileActions>;

export const ProfileInfoPanel: FC<{ state: ProfileState }> = ({ state }) => (
  <ProfileInfoForm user={state.user} inputClass={profileInputClass} onSave={state.saveProfile} />
);
