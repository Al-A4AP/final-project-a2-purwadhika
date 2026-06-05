import type { ContactPageState } from "../../pages/contact/contactTypes";
import { useContactForm } from "./useContactForm";
import { useFaqState } from "./useFaqState";

export const useContactPageState = (): ContactPageState => ({
  contactForm: useContactForm(),
  faq: useFaqState(),
});
