import type { FC } from "react";

interface RoomActionButtonProps {
  className: string;
  icon: FC<{ size?: number }>;
  label: string;
  onClick: () => void;
  roomType: string;
}

export const RoomActionButton: FC<RoomActionButtonProps> = ({ className, icon: Icon, label, onClick, roomType }) => (
  <button onClick={onClick} className={`flex h-10 items-center justify-center rounded-lg sm:w-10 ${className}`} title={label} aria-label={`${label} ${roomType}`}>
    <Icon size={14} />
  </button>
);
