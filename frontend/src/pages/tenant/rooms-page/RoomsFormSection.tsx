import type { FC } from "react";
import { RoomForm } from "@/components/tenant/RoomForm";
import type { RoomFormInput } from "@/types";

interface RoomsFormSectionProps {
  form: RoomFormInput;
  handleSubmit: (event: React.FormEvent) => void;
  isWholeUnit: boolean;
  setForm: (form: RoomFormInput) => void;
  showForm: boolean;
}

export const RoomsFormSection: FC<RoomsFormSectionProps> = ({ form, handleSubmit, isWholeUnit, setForm, showForm }) => (
  showForm ? <RoomForm isEditing={form.room_type !== ""} isWholeUnit={isWholeUnit} form={form} onChange={setForm} onSubmit={handleSubmit} /> : null
);
