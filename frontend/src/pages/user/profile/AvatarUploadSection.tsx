import type { FC } from "react";
import type { useProfileActions } from "./useProfileActions";
import { ProfileAvatarCard } from "@/components/user/profile/ProfileAvatarCard";

type ProfileState = ReturnType<typeof useProfileActions>;

export const AvatarUploadSection: FC<{ state: ProfileState }> = ({ state }) => (
  <ProfileAvatarCard user={state.user} fileRef={state.fileRef} uploading={state.uploadingAvatar} onAvatarChange={state.handleAvatarChange} />
);
