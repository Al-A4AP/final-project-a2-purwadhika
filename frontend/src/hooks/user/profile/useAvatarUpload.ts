import type { ChangeEvent, RefObject } from "react";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { User } from "@/types";
import { isValidAvatar } from "./profileRules";
import { updateAvatarAction } from "./profileActions";

type SetUser = (user: User | null) => void;

export const useAvatarUpload = (setUser: SetUser) => {
  const state = useAvatarCropState();
  const actions = useAvatarCropActions(state, setUser);
  return { cropperSrc: state.cropperSrc, fileRef: state.fileRef, uploadingAvatar: state.uploadingAvatar, ...actions };
};

const useAvatarCropState = () => {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  return { cropperSrc, fileRef, setCropperSrc, setUploadingAvatar, uploadingAvatar };
};

const useAvatarCropActions = (state: AvatarCropState, setUser: SetUser) => {
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) openAvatarCropper(file, state.setCropperSrc);
  };

  const handleCropComplete = async (blob: Blob) => {
    await uploadCroppedAvatar(blob, { ...state, setUser });
  };

  const closeCropper = () => {
    state.setCropperSrc(null);
    resetFileInput(state.fileRef);
  };

  return { closeCropper, handleAvatarChange, handleCropComplete };
};

const openAvatarCropper = (file: File, setCropperSrc: (value: string) => void) => {
  if (!isValidAvatar(file)) return toast.error("Avatar harus JPG, PNG, atau GIF dengan ukuran maksimal 1MB.");
  setCropperSrc(URL.createObjectURL(file));
};

const uploadCroppedAvatar = async (blob: Blob, actions: AvatarUploadActions) => {
  actions.setUploadingAvatar(true);
  try {
    await updateAvatarAction(createAvatarFile(blob), actions.setUser);
  } catch {
    toast.error("Gagal mengunggah avatar");
  } finally {
    finishAvatarUpload(actions);
  }
};

const finishAvatarUpload = (actions: AvatarUploadActions) => {
  actions.setUploadingAvatar(false);
  actions.setCropperSrc(null);
  resetFileInput(actions.fileRef);
};

const createAvatarFile = (blob: Blob) =>
  new File([blob], "avatar.jpg", { type: "image/jpeg" });

const resetFileInput = (fileRef: RefObject<HTMLInputElement | null>) => {
  if (fileRef.current) fileRef.current.value = "";
};

interface AvatarUploadActions {
  fileRef: RefObject<HTMLInputElement | null>;
  setCropperSrc: (value: string | null) => void;
  setUploadingAvatar: (value: boolean) => void;
  setUser: SetUser;
}

type AvatarCropState = ReturnType<typeof useAvatarCropState>;
