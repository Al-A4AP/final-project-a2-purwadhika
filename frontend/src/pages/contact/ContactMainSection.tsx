import type { FC } from "react";
import { ContactFormSection } from "./ContactFormSection";
import { FaqSection } from "./FaqSection";
import type { ContactPageState } from "./contactTypes";

export const ContactMainSection: FC<{ state: ContactPageState }> = ({ state }) => (
  <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
    <ContactFormSection state={state.contactForm} />
    <FaqSection state={state.faq} />
  </section>
);
