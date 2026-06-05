import { useCallback } from "react";
import type { UseFormSetError } from "react-hook-form";
import { authService } from "@/services/authService";
import type { RegisterInput } from "@/validations/auth";
import { getRegisterErrorMessage, notifyRegisterSuccess } from "../../../pages/auth/register/registerActions";

export const useRegisterSubmit = (
  setError: UseFormSetError<RegisterInput>,
  setRegisteredEmail: (email: string | null) => void,
) => useCallback(async (data: RegisterInput) => {
  try {
    const result = await authService.register(data);
    setRegisteredEmail(result.email);
    notifyRegisterSuccess();
  } catch (err) {
    const message = getRegisterErrorMessage(err);
    setError("root", { message });
  }
}, [setError, setRegisteredEmail]);
