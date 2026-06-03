import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import { RoomTextField } from "./RoomTextField";

export const RoomChildPriceField: FC<{ form: RoomFormInput; inputClass: string; onChange: (form: RoomFormInput) => void }> = (props) => (
  <div>
    <RoomTextField {...props} name="child_price" label="Harga Anak-anak/malam (Rp)" type="number" min="0" step="10000" isPrice placeholder="Kosongkan jika = dewasa" />
    <p className="mt-0.5 text-xs text-gray-400">Bayi selalu gratis</p>
  </div>
);
