import type { FC } from "react";
import { Eye, EyeOff } from "lucide-react";
import { VISIBILITY_BUTTON_CLASS } from "./verifyEmailStyles";

type VisibilityButtonProps = {
  visible: boolean;
  onToggle: () => void;
};

export const VisibilityButton: FC<VisibilityButtonProps> = ({ visible, onToggle }) => (
  <button type="button" onClick={onToggle} className={VISIBILITY_BUTTON_CLASS}>
    {visible ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
);
