import type { FC } from 'react';
import { Minus, Plus } from 'lucide-react';

interface CounterStepperProps {
  decrementLabel: string;
  incrementLabel: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  disableDecrease?: boolean;
  disableIncrease?: boolean;
}

export const CounterStepper: FC<CounterStepperProps> = (props) => (
  <div className="flex items-center gap-3">
    <CounterButton icon="minus" label={props.decrementLabel} onClick={props.onDecrease} disabled={props.disableDecrease} />
    <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">{props.value}</span>
    <CounterButton icon="plus" label={props.incrementLabel} onClick={props.onIncrease} disabled={props.disableIncrease} />
  </div>
);

const CounterButton: FC<CounterButtonProps> = ({ icon, label, onClick, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label} className={buttonClass}>
    {icon === 'minus' ? <Minus size={16} /> : <Plus size={16} />}
  </button>
);

const buttonClass = 'w-8 h-8 rounded-full border dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition';

interface CounterButtonProps {
  icon: 'minus' | 'plus';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
