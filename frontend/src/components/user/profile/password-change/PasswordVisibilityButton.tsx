import type { FC } from "react";
import { Eye, EyeOff } from "lucide-react";

export const PasswordVisibilityButton: FC<{ isVisible: boolean; onToggle: () => void }> = ({ isVisible, onToggle }) => (
  <button type="button" onClick={onToggle} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400">
    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
);
