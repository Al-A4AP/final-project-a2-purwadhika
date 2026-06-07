import { useAuthStore } from "@/stores/authStore";
import { canChangePassword } from "./profileRules";
import { requestEmailChangeAction, savePasswordAction, saveProfileAction } from "./profileActions";
import { useAvatarUpload } from "./useAvatarUpload";
import type { ProfileInput } from "@/validations/profile";

export const useProfileActions = () => {
  const { user, setUser } = useAuthStore();
  const avatar = useAvatarUpload(setUser);
  return {
    ...avatar,
    canChangePassword: canChangePassword(user),
    requestEmailChange: (email: string) => requestEmailChangeAction(email, setUser),
    savePassword: savePasswordAction,
    saveProfile: (data: ProfileInput) => saveProfileAction(data, setUser),
    user,
  };
};
