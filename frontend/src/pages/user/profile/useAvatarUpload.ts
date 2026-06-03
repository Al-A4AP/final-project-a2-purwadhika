import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "@/types";
import { isValidAvatar } from "./profileRules";
import { updateAvatarAction } from "./profileActions";

type SetUser = (user: User | null) => void;

export const useAvatarUpload = (setUser: SetUser) => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isValidAvatar(file)) {
      return toast.error("Avatar harus JPG, PNG, atau GIF dengan ukuran maksimal 1MB.");
    }
    setCropperSrc(URL.createObjectURL(file));
  };

  const handleCropComplete = async (blob: Blob) => {
    setUploadingAvatar(true);
    try {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      await updateAvatarAction(file, setUser);
    } catch {
      toast.error("Gagal mengunggah avatar");
    } finally {
      setUploadingAvatar(false);
      setCropperSrc(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const closeCropper = () => {
    setCropperSrc(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return {
    fileRef,
    handleAvatarChange,
    uploadingAvatar,
    cropperSrc,
    handleCropComplete,
    closeCropper,
  };
};
