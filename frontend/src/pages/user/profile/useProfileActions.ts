import { useAuthStore } from "@/stores/authStore";
import { canChangePassword } from "./profileRules";
import { requestEmailChangeAction, savePasswordAction, saveProfileAction } from "./profileActions";
import { useAvatarUpload } from "./useAvatarUpload";

export const useProfileActions = () => {
  const { user, setUser } = useAuthStore();
  const avatar = useAvatarUpload(setUser);
  return {
    ...avatar,
    canChangePassword: canChangePassword(user),
    requestEmailChange: (email: string) => requestEmailChangeAction(email, setUser),
    savePassword: savePasswordAction,
    saveProfile: (data: { name?: string; phone?: string }) => saveProfileAction(data, setUser),
    user,
  };
};
