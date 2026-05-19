import type { FC } from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

const WhatsAppButton: FC = () => {
  const handleClick = () => {
    const message = 'Halo, saya ingin bertanya tentang properti di Property Renting.';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all flex items-center justify-center text-white z-40"
      title="Hubungi kami via WhatsApp"
    >
      <MessageCircle size={28} />
    </button>
  );
};

export default WhatsAppButton;
