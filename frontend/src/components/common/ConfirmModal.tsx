import type { FC, ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  if (!props.isOpen) return null;
  return (
    <ConfirmModalShell>
      <ConfirmModalBody {...props} />
    </ConfirmModalShell>
  );
};

const ConfirmModalShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 z-9999 flex animate-fade-in items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-2xl transition-all duration-200 dark:border-slate-700 dark:bg-slate-800">
      {children}
    </div>
  </div>
);

const ConfirmModalBody: FC<ConfirmModalProps> = (props) => (
  <>
    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{props.title}</h3>
    <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-350">{props.message}</p>
    <ConfirmModalActions {...props} />
  </>
);

const ConfirmModalActions: FC<ConfirmModalProps> = (props) => (
  <div className="flex justify-end gap-3">
    <button type="button" onClick={props.onCancel} className={cancelButtonClass}>Batal</button>
    <button type="button" onClick={props.onConfirm} disabled={props.confirmDisabled} className={confirmButtonClass}>
      {props.confirmText || 'Ya, Hapus'}
    </button>
  </div>
);

const cancelButtonClass =
  'rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800';
const confirmButtonClass =
  'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60';
