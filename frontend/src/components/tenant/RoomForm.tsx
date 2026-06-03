import type { FC } from "react";
import { RoomFormFields } from "./room-form/RoomFormFields";
import { RoomFormHeader } from "./room-form/RoomFormHeader";
import { RoomSubmitButton } from "./room-form/RoomSubmitButton";
import type { RoomFormProps } from "./room-form/types";

export const RoomForm: FC<RoomFormProps> = (props) => (
  <form onSubmit={props.onSubmit} className="space-y-4 rounded-xl border bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
    <RoomFormHeader isEditing={props.isEditing} isWholeUnit={props.isWholeUnit} />
    <RoomFormFields
      form={props.form}
      isEditing={props.isEditing}
      isWholeUnit={props.isWholeUnit}
      editingRoom={props.editingRoom}
      onChange={props.onChange}
      fetchRooms={props.fetchRooms}
      setEditingRoom={props.setEditingRoom}
    />
    <RoomSubmitButton />
  </form>
);
