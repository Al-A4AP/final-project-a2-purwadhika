import type { FC } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export const MobileMenuButton: FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => (
  <div className="md:hidden flex items-center space-x-4">
    <ThemeToggle />
    <button onClick={onToggle} className="text-slate-600 dark:text-slate-300 focus:outline-none">
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>
);
