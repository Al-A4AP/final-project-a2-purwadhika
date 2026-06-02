import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const whatsappMessage = 'Halo, saya ingin bertanya tentang properti di PURWALOKA.';

const getWhatsAppUrl = () =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

const openWhatsApp = () => window.open(getWhatsAppUrl(), '_blank');

const WhatsAppButton: FC = () => (
  <button
    onClick={openWhatsApp}
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
    title="Hubungi kami via WhatsApp"
    aria-label="Hubungi kami via WhatsApp"
  >
    <MessageCircle size={28} />
  </button>
);

export default WhatsAppButton;
