import type { FC } from "react";
import type { useProfileActions } from "@/hooks/user/profile/useProfileActions";
import { AvatarUploadSection } from "./AvatarUploadSection";
import { EmailPanel } from "./EmailPanel";
import { PasswordPanel } from "./PasswordPanel";
import { ProfileInfoPanel } from "./ProfileInfoPanel";

type ProfileState = ReturnType<typeof useProfileActions>;

export const ProfileContent: FC<{ state: ProfileState }> = ({ state }) => (
  <div className="mx-auto max-w-2xl">
    <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
    <AvatarUploadSection state={state} />
    <ProfileInfoPanel state={state} />
    <EmailPanel state={state} />
    <PasswordPanel state={state} />
  </div>
);
