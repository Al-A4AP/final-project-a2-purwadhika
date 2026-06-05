import type { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthClasses = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <ModalPanel maxWidth={maxWidth}>
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody>{children}</ModalBody>
      </ModalPanel>
    </ModalBackdrop>
  );
};

const ModalBackdrop: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-9999 animate-fade-in">
    {children}
  </div>
);

const ModalPanel: FC<Pick<ModalProps, 'maxWidth' | 'children'>> = ({ maxWidth = 'md', children }) => (
  <div className={`bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 rounded-3xl w-full ${maxWidthClasses[maxWidth]} shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]`}>
    {children}
  </div>
);

const ModalHeader: FC<Pick<ModalProps, 'title' | 'onClose'>> = ({ title, onClose }) => (
  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-3xl">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    <CloseButton onClose={onClose} />
  </div>
);

const CloseButton: FC<{ onClose: () => void }> = ({ onClose }) => (
  <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
    <X size={20} />
  </button>
);

const ModalBody: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
);
