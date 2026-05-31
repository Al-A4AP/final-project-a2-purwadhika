import type { FC } from "react";
import { ContactContent } from "./contact/ContactContent";
import { useContactPageState } from "./contact/useContactPageState";

const ContactPage: FC = () => <ContactContent state={useContactPageState()} />;

export default ContactPage;
