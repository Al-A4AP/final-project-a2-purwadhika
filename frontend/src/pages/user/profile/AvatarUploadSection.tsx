import type { FC } from "react";
import type { useProfileActions } from "@/hooks/user/profile/useProfileActions";
import { ProfileAvatarCard } from "@/components/user/profile/ProfileAvatarCard";
import { ImageCropperModal } from "@/components/common/ImageCropperModal";

type ProfileState = ReturnType<typeof useProfileActions>;

export const AvatarUploadSection: FC<{ state: ProfileState }> = ({ state }) => (
  <>
    <ProfileAvatarCard
      user={state.user}
      fileRef={state.fileRef}
      uploading={state.uploadingAvatar}
      onAvatarChange={state.handleAvatarChange}
    />
    <ImageCropperModal
      isOpen={Boolean(state.cropperSrc)}
      onClose={state.closeCropper}
      imageSrc={state.cropperSrc}
      aspect={1}
      onCropComplete={state.handleCropComplete}
    />
  </>
);
