import type { FormEvent } from "react";
import type { RoomFormInput } from "@/types";

export interface RoomFormProps {
  form: RoomFormInput;
  isEditing: boolean;
  onChange: (form: RoomFormInput) => void;
  onSubmit: (event: FormEvent) => void;
}

export type RoomFormFieldName = keyof RoomFormInput;
