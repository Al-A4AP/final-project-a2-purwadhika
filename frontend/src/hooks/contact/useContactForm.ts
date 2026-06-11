import { useState } from "react";
import type { FormEvent } from "react";
import type { ContactFormData, ContactFormState } from "../../pages/contact/contactTypes";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { getApiErrorMessage } from "@/lib/errorMessage";

const EMPTY_FORM: ContactFormData = { name: "", email: "", subject: "", message: "" };

export const useContactForm = (): ContactFormState => {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (name: keyof ContactFormData, value: string) =>
    setForm((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact-messages", form);
      setSubmitted(true);
      toast.success("Pesan berhasil dikirim");
      window.setTimeout(() => setSubmitted(false), 4000);
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Gagal mengirim pesan"));
    } finally {
      setLoading(false);
    }
  };

  return { form, submitted, loading, updateField, handleSubmit };
};
