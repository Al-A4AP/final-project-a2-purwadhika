import { useForm } from "react-hook-form";
import type { EmailChangeInput } from "@/validations/profile";
import { emailFormResolver } from "./emailFormResolver";

export const useEmailChangeForm = (onRequest: (email: string) => Promise<void>) => {
  const form = useForm<EmailChangeInput>({ resolver: emailFormResolver });
  const submit = async (data: EmailChangeInput) => {
    await onRequest(data.email);
    form.reset();
  };
  return { form, submit };
};
