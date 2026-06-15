import type { FC } from "react";
import { roomInputClass } from "./roomFormStyles";
import { RoomChildPriceField } from "./RoomChildPriceField";
import { RoomDescriptionField } from "./RoomDescriptionField";
import { RoomImageField } from "./RoomImageField";
import { RoomTextField } from "./RoomTextField";
import type { RoomFormProps } from "./types";

type RoomFormFieldsProps = Omit<RoomFormProps, "onSubmit">;

const QuantityField: FC<Pick<RoomFormFieldsProps, "form" | "isWholeUnit" | "onChange">> = ({ form, isWholeUnit, onChange }) => (
  isWholeUnit ? null : (
    <RoomTextField 
      form={form} 
      onChange={onChange} 
      inputClass={roomInputClass} 
      name="quantity" 
      label="Jumlah Unit / Stok Kamar" 
      type="number" 
      min="1" 
      max="20"
      placeholder="1" 
      required 
    />
  )
);

export const RoomFormFields: FC<RoomFormFieldsProps> = ({ form, isEditing, isWholeUnit, editingRoom, onChange, fetchRooms, setEditingRoom }) => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
    <div className="md:col-span-2">
      <RoomTextField 
        form={form} 
        onChange={onChange} 
        inputClass={roomInputClass} 
        name="room_type" 
        label="Tipe Kamar" 
        placeholder="Contoh: Deluxe Room, Master Bedroom..." 
        required 
      />
    </div>
    
    <RoomTextField 
      form={form} 
      onChange={onChange} 
      inputClass={roomInputClass} 
      name="base_price" 
      label="Harga per Malam (Dewasa)" 
      type="number" 
      min="0" 
      step="10000" 
      isPrice 
      placeholder="500000" 
      required 
    />
    
    <RoomChildPriceField 
      form={form} 
      onChange={onChange} 
      inputClass={roomInputClass} 
    />
    
    <RoomTextField 
      form={form} 
      onChange={onChange} 
      inputClass={roomInputClass} 
      name="capacity" 
      label="Kapasitas Maksimal (Orang)" 
      type="number" 
      min="1" 
      placeholder="2" 
      required 
    />
    
    <QuantityField form={form} isWholeUnit={isWholeUnit} onChange={onChange} />
    
    <div className="md:col-span-2 pt-2">
      <RoomDescriptionField 
        form={form} 
        onChange={onChange} 
        inputClass={roomInputClass} 
      />
    </div>

    <div className="md:col-span-2 pt-2">
      <RoomImageField
        form={form}
        onChange={onChange}
        inputClass={roomInputClass}
        isEditing={isEditing}
        editingRoom={editingRoom}
        fetchRooms={fetchRooms}
        setEditingRoom={setEditingRoom}
      />
    </div>
  </div>
);
