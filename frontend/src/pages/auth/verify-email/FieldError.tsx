import type { FC } from "react";

export const FieldError: FC<{ message?: string }> = ({ message }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;
