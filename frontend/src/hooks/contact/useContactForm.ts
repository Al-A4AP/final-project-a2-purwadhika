import { useState } from "react";
import type { FormEvent } from "react";
import type { ContactFormData, ContactFormState } from "../../pages/contact/contactTypes";
import toast from "react-hot-toast";

const EMPTY_FORM: ContactFormData = { name: "", email: "", subject: "", message: "" };

export const useContactForm = (): ContactFormState => {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const updateField = (name: keyof ContactFormData, value: string) =>
    setForm((current) => ({ ...current, [name]: value }));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Pesan berhasil disiapkan");
    window.setTimeout(() => setSubmitted(false), 4000);
    setForm(EMPTY_FORM);
  };
  return { form, submitted, updateField, handleSubmit };
};
