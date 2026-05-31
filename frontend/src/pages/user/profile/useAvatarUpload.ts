import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "@/types";
import { isValidAvatar } from "./profileRules";
import { updateAvatarAction } from "./profileActions";

type SetUser = (user: User | null) => void;

export const useAvatarUpload = (setUser: SetUser) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isValidAvatar(file)) return toast.error("Avatar harus JPG, PNG, atau GIF dengan ukuran maksimal 1MB.");
    setUploadingAvatar(true);
    await updateAvatarAction(file, setUser);
    setUploadingAvatar(false);
  };
  return { fileRef, handleAvatarChange, uploadingAvatar };
};
