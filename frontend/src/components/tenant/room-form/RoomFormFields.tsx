import type { FC } from "react";
import { roomInputClass } from "./roomFormStyles";
import { RoomChildPriceField } from "./RoomChildPriceField";
import { RoomDescriptionField } from "./RoomDescriptionField";
import { RoomImageField } from "./RoomImageField";
import { RoomTextField } from "./RoomTextField";
import type { RoomFormProps } from "./types";

type RoomFormFieldsProps = Omit<RoomFormProps, "onSubmit">;

const QuantityField: FC<RoomFormFieldsProps> = ({ form, isWholeUnit, onChange }) => (
  isWholeUnit ? null : <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="quantity" label="Jumlah Unit" type="number" min="1" placeholder="1" required />
);

export const RoomFormFields: FC<RoomFormFieldsProps> = ({ form, isEditing, isWholeUnit, onChange }) => (
  <div className="grid grid-cols-2 gap-3">
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="room_type" label="Tipe Kamar" className="col-span-2" placeholder="cth. Deluxe Room" required />
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="base_price" label="Harga Dewasa/malam (Rp)" type="number" min="0" placeholder="500000" required />
    <RoomChildPriceField form={form} onChange={onChange} inputClass={roomInputClass} />
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="capacity" label="Kapasitas (orang)" type="number" min="1" placeholder="2" required />
    <QuantityField form={form} isEditing={isEditing} isWholeUnit={isWholeUnit} onChange={onChange} />
    <RoomImageField form={form} onChange={onChange} inputClass={roomInputClass} isEditing={isEditing} />
    <RoomDescriptionField form={form} onChange={onChange} inputClass={roomInputClass} />
  </div>
);
