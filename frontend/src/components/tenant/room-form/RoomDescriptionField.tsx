import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import { RoomTextField } from "./RoomTextField";

export const RoomDescriptionField: FC<{ form: RoomFormInput; inputClass: string; onChange: (form: RoomFormInput) => void }> = (props) => (
  <RoomTextField {...props} name="description" label="Deskripsi (opsional)" className="col-span-2" />
);
