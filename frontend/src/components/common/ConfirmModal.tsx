import { useState } from 'react';
import type { FC, ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmDisabled?: boolean;
  onConfirm: (reason?: string) => void | Promise<void>;
  onCancel: () => void;
  reasonMaxLength?: number;
  reasonMinLength?: number;
  showReasonInput?: boolean;
}

export const ConfirmModal: FC<ConfirmModalProps> = (props) =>
  props.isOpen ? <ConfirmModalContent {...props} /> : null;

const ConfirmModalContent: FC<ConfirmModalProps> = (props) => {
  const [reason, setReason] = useState("");
  return (
    <ConfirmModalShell>
      <ConfirmModalBody {...props} reason={reason} setReason={setReason} />
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

const ConfirmModalBody: FC<ConfirmModalProps & { reason: string, setReason: (v: string) => void }> = (props) => (
  <>
    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{props.title}</h3>
    <p className={props.showReasonInput ? "mb-2 text-sm leading-relaxed text-gray-600 dark:text-gray-350" : "mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-350"}>{props.message}</p>
    {props.showReasonInput && (
      <ReasonField {...props} />
    )}
    <ConfirmModalActions {...props} confirmDisabled={props.confirmDisabled || isReasonInvalid(props)} onConfirm={() => props.onConfirm(props.reason.trim())} />
  </>
);

const ReasonField: FC<ConfirmModalProps & { reason: string; setReason: (value: string) => void }> = (props) => (
  <div className="mb-6">
    <textarea
      className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-400 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      placeholder="Tulis alasan penolakan..."
      rows={3}
      value={props.reason}
      onChange={(event) => props.setReason(event.target.value)}
      minLength={props.reasonMinLength}
      maxLength={props.reasonMaxLength}
      required
    />
    <ReasonFieldHelp {...props} />
  </div>
);

const ReasonFieldHelp: FC<Pick<ConfirmModalProps, "reasonMaxLength" | "reasonMinLength"> & { reason: string }> = (props) => (
  <div className="mt-1 flex justify-between gap-3 text-xs text-slate-500">
    <span>{props.reasonMinLength ? `Minimal ${props.reasonMinLength} karakter` : null}</span>
    <span>{props.reasonMaxLength ? `${props.reason.length}/${props.reasonMaxLength}` : null}</span>
  </div>
);

const isReasonInvalid = (props: ConfirmModalProps & { reason: string }) => {
  if (!props.showReasonInput) return false;
  const length = props.reason.trim().length;
  return length < (props.reasonMinLength || 1)
    || Boolean(props.reasonMaxLength && length > props.reasonMaxLength);
};

const ConfirmModalActions: FC<ConfirmModalProps> = (props) => (
  <div className="flex justify-end gap-3">
    <button type="button" onClick={props.onCancel} className={cancelButtonClass}>{props.cancelText || 'Batal'}</button>
    <button type="button" onClick={() => props.onConfirm()} disabled={props.confirmDisabled} className={confirmButtonClass}>
      {props.confirmText || 'Ya, Hapus'}
    </button>
  </div>
);

const cancelButtonClass =
  'rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800';
const confirmButtonClass =
  'rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60';
