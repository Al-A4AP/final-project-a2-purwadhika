import type { FormEvent } from "react";
import type { LucideIcon } from "lucide-react";

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactInfoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  desc: string;
};

export type FaqItemData = {
  q: string;
  a: string;
};

export type ContactFormState = {
  form: ContactFormData;
  submitted: boolean;
  loading: boolean;
  updateField: (name: keyof ContactFormData, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type FaqState = {
  openFaq: number | null;
  toggleFaq: (index: number) => void;
};

export type ContactPageState = {
  contactForm: ContactFormState;
  faq: FaqState;
};
