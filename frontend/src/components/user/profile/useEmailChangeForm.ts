import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailChangeSchema, type EmailChangeInput } from "@/validations/profile";

export const useEmailChangeForm = (onRequest: (email: string) => Promise<void>) => {
  const form = useForm<EmailChangeInput>({ resolver: zodResolver(emailChangeSchema) });
  const submit = async (data: EmailChangeInput) => {
    await onRequest(data.email);
    form.reset();
  };
  return { form, submit };
};
