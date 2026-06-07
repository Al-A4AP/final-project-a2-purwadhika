import type { FC } from "react";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";
import { RoomFieldShell } from "./RoomFieldShell";
import { ImageCropperModal } from "@/components/common/ImageCropperModal";
import { useRoomImageField } from "@/hooks/tenant/room-form/useRoomImageField";
import { RoomGalleryGrid } from "./RoomGalleryGrid";
import { RoomImageDropzone } from "./RoomImageDropzone";

interface RoomImageFieldProps {
  form: RoomFormInput;
  inputClass: string;
  isEditing: boolean;
  editingRoom?: RoomWithPeakRates | null;
  onChange: (form: RoomFormInput) => void;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
}

export const RoomImageField: FC<RoomImageFieldProps> = ({
  form,
  isEditing,
  editingRoom,
  onChange,
  fetchRooms,
  setEditingRoom,
}) => {
  const imageField = useRoomImageField({
    editingRoom,
    fetchRooms,
    form,
    isEditing,
    onChange,
    setEditingRoom,
  });

  return (
    <RoomFieldShell label="Galeri Foto Kamar" className="space-y-4">
      <RoomImageDropzone
        isEditing={isEditing}
        previewUrl={imageField.previewUrl}
        onFileChange={imageField.openMainCropper}
      />

      {isEditing && editingRoom && imageField.roomImages.length > 0 && (
        <RoomGalleryGrid
          canDelete={imageField.canDelete}
          images={imageField.roomImages}
          uploadingGallery={imageField.uploadingGallery}
          onDelete={imageField.deleteGalleryImage}
          onSetMain={imageField.setMainGalleryImage}
          onGalleryFileChange={imageField.openGalleryCropper}
        />
      )}

      <ImageCropperModal
        isOpen={Boolean(imageField.cropperSrc)}
        onClose={imageField.closeCropper}
        imageSrc={imageField.cropperSrc}
        aspect={4 / 3}
        onCropComplete={imageField.handleCropComplete}
      />
    </RoomFieldShell>
  );
};
