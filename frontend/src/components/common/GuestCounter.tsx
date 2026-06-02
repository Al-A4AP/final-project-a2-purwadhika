import type { FC } from "react";
import { CounterStepper } from "./CounterStepper";

interface GuestCounterProps {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export const GuestCounter: FC<GuestCounterProps> = (props) => (
  <div className="flex items-center justify-between py-3 border-b dark:border-slate-600 last:border-0">
    <GuestCounterCopy label={props.label} description={props.description} />
    <CounterStepper decrementLabel={`Kurangi ${props.label}`} incrementLabel={`Tambah ${props.label}`}
      value={props.value} onDecrease={() => changeValue(props, -1)} onIncrease={() => changeValue(props, 1)}
      disableDecrease={props.value <= getMin(props)} disableIncrease={props.value >= getMax(props)}
    />
  </div>
);

const GuestCounterCopy: FC<Pick<GuestCounterProps, "label" | "description">> = ({ label, description }) => (
  <div>
    <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

const changeValue = (props: GuestCounterProps, delta: number) =>
  props.onChange(clamp(props.value + delta, getMin(props), getMax(props)));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getMin = ({ min = 0 }: GuestCounterProps) => min;
const getMax = ({ max = 99 }: GuestCounterProps) => max;
