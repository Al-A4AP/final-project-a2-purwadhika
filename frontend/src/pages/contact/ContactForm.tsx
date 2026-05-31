import type { FC } from "react";
import { ContactSubmitButton } from "./ContactSubmitButton";
import { MessageField } from "./MessageField";
import { TextInputField } from "./TextInputField";
import type { ContactFormState } from "./contactTypes";

export const ContactForm: FC<{ state: ContactFormState }> = ({ state }) => (
  <form onSubmit={state.handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <TextInputField label="Nama Lengkap" name="name" type="text" placeholder="John Doe" state={state} />
      <TextInputField label="Alamat Email" name="email" type="email" placeholder="john@example.com" state={state} />
    </div>
    <TextInputField label="Subjek" name="subject" type="text" placeholder="Bagaimana kami bisa membantu?" state={state} />
    <MessageField state={state} />
    <ContactSubmitButton />
  </form>
);
