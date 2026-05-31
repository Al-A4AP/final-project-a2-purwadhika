import type { FC } from "react";

export const ResetPasswordErrorNotice: FC<{ message?: string }> = ({ message }) => (
  message ? <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 dark:bg-red-900/20"><p className="text-sm text-red-600">{message}</p></div> : null
);
