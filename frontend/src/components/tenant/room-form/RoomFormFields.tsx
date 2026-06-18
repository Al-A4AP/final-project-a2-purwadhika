import type { FC } from "react";
import { roomInputClass } from "./roomFormStyles";
import { RoomChildPriceField } from "./RoomChildPriceField";
import { RoomDescriptionField } from "./RoomDescriptionField";
import { RoomImageField } from "./RoomImageField";
import { RoomTextField } from "./RoomTextField";
import type { RoomFormProps } from "./types";
import { MAX_ADULT_CAPACITY, MAX_DAILY_PRICE } from "@/constants/validation";

type RoomFormFieldsProps = Omit<RoomFormProps, "isSubmitting" | "onSubmit">;

const QuantityField: FC<Pick<RoomFormFieldsProps, "form" | "isWholeUnit" | "onChange">> = ({ form, isWholeUnit, onChange }) => {
  if (isWholeUnit) return null;
  return (
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="quantity"
      label="Jumlah Unit / Stok Kamar" type="number" min="1" max="20" placeholder="1" required />
  );
};

export const RoomFormFields: FC<RoomFormFieldsProps> = (props) => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <RoomTypeField {...props} />
    <RoomPricingFields {...props} />
    <RoomCapacityFields {...props} />
    <RoomMediaFields {...props} />
  </div>
);

const RoomTypeField: FC<RoomFormFieldsProps> = ({ form, onChange }) => (
  <div className="md:col-span-2">
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="room_type"
      label="Tipe Kamar" placeholder="Contoh: Deluxe Room, Master Bedroom..." required />
  </div>
);

const RoomPricingFields: FC<RoomFormFieldsProps> = ({ form, onChange }) => (
  <>
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="base_price"
      label="Harga per Malam (Dewasa)" type="number" min="1" max={String(MAX_DAILY_PRICE)}
      step="10000" isPrice placeholder="500000" required />
    <RoomChildPriceField form={form} onChange={onChange} inputClass={roomInputClass} />
  </>
);

const RoomCapacityFields: FC<RoomFormFieldsProps> = ({ form, isWholeUnit, onChange }) => (
  <>
    <RoomTextField form={form} onChange={onChange} inputClass={roomInputClass} name="capacity"
      label="Kapasitas Dewasa" type="number" min="1" max={String(MAX_ADULT_CAPACITY)} placeholder="2" required />
    <QuantityField form={form} isWholeUnit={isWholeUnit} onChange={onChange} />
  </>
);

const RoomMediaFields: FC<RoomFormFieldsProps> = (props) => (
  <>
    <div className="md:col-span-2 pt-2">
      <RoomDescriptionField form={props.form} onChange={props.onChange} inputClass={roomInputClass} />
    </div>
    <div className="md:col-span-2 pt-2">
      <RoomImageField form={props.form} onChange={props.onChange} inputClass={roomInputClass}
        isEditing={props.isEditing} editingRoom={props.editingRoom} fetchRooms={props.fetchRooms}
        setEditingRoom={props.setEditingRoom} />
    </div>
  </>
);
