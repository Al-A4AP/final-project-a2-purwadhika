import type { FC } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactLink: FC<{ href: string; icon: FC<{ size?: number }>; label: string }> = ({ href, icon: Icon, label }) => (
  <div className="flex items-center gap-2"><Icon size={16} /><a href={href} className="transition hover:text-white">{label}</a></div>
);

export const FooterContact: FC = () => (
  <div>
    <h4 className="mb-4 font-semibold text-white">Hubungi Kami</h4>
    <div className="space-y-3 text-sm">
      <ContactLink href="mailto:info@purwaloka.com" icon={Mail} label="info@purwaloka.com" />
      <ContactLink href="tel:+6281909333337" icon={Phone} label="+62 819 0933 3337" />
      <div className="flex items-start gap-2"><MapPin size={16} className="mt-1 shrink-0" /><span>Bandung, Indonesia</span></div>
    </div>
  </div>
);
