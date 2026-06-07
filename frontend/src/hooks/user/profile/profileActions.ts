import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { userService } from "@/services/userService";
import type { User } from "@/types";
import type { ProfileInput } from "@/validations/profile";

type SetUser = (user: User | null) => void;

export const saveProfileAction = async (data: ProfileInput, setUser: SetUser) => {
  try {
    setUser(await userService.updateProfile(data));
    toast.success("Profil berhasil disimpan!");
  } catch (err) { toast.error(getApiErrorMessage(err, "Profil belum bisa disimpan. Periksa data lalu coba lagi.")); }
};

export const requestEmailChangeAction = async (email: string, setUser: SetUser) => {
  try {
    setUser(await userService.requestEmailChange(email));
    toast.success("Link verifikasi dikirim ke email baru.");
  } catch (err) { toast.error(getApiErrorMessage(err, "Verifikasi email baru gagal dikirim. Pastikan email valid lalu coba lagi.")); }
};

export const savePasswordAction = async (data: { old_password: string; new_password: string }) => {
  try { await userService.changePassword(data); toast.success("Password berhasil diubah!"); }
  catch (err) { toast.error(getApiErrorMessage(err, "Password gagal diubah. Periksa password lama dan aturan password baru.")); }
};

export const updateAvatarAction = async (file: File, setUser: SetUser) => {
  try {
    setUser(await userService.updateAvatar(file));
    toast.success("Foto profil berhasil diperbarui");
  } catch (err) { toast.error(getApiErrorMessage(err, "Foto profil gagal diunggah. Gunakan JPG, PNG, atau GIF maksimal 1MB.")); }
};
