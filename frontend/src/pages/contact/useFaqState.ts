import { useState } from "react";
import type { FaqState } from "./contactTypes";

export const useFaqState = (): FaqState => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => setOpenFaq((current) => (current === index ? null : index));
  return { openFaq, toggleFaq };
};
