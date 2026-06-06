import type { FC } from "react";
import { ProfileContent } from "./profile/ProfileContent";
import { useProfileActions } from "@/hooks/user/profile/useProfileActions";

const ProfilePage: FC = () => {
  const state = useProfileActions();
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-slate-900">
      <ProfileContent state={state} />
    </div>
  );
};

export default ProfilePage;
