import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { orderService } from '@/services/orderService';
import type { PropertyDetail, Room, ApiResponse } from '@/types';
import type { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

import { GuestCounter } from '@/components/user/GuestCounter';
import { PaymentMethodSelector } from '@/components/user/PaymentMethodSelector';
import { BookingSummary } from '@/components/user/BookingSummary';

declare global {
  interface Window { snap: { pay: (token: string, options: Record<string, unknown>) => void } }
}

const BookingPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = searchParams.get('propertyId');
  const roomId = searchParams.get('roomId');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'MANUAL' | 'MIDTRANS'>('MIDTRANS');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, babies: 0 });

  const updateGuest = (type: 'adults' | 'children' | 'babies', delta: number) => {
    if (!room) return;
    setGuests((prev) => {
      let nextAdults = prev.adults, nextChildren = prev.children, nextBabies = prev.babies;
      if (type === 'adults') {
        nextAdults = Math.max(1, Math.min(room.capacity, prev.adults + delta));
        nextChildren = Math.min(nextAdults, nextChildren);
        nextBabies = Math.min(nextAdults, nextBabies);
      } else if (type === 'children') {
        nextChildren = Math.max(0, Math.min(prev.adults, prev.children + delta));
      } else {
        nextBabies = Math.max(0, Math.min(prev.adults, prev.babies + delta));
      }
      return { adults: nextAdults, children: nextChildren, babies: nextBabies };
    });
  };

  useEffect(() => {
    if (!propertyId || !roomId || !checkIn || !checkOut) { navigate('/'); return; }
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);

    propertyService.getPropertyDetail(propertyId, checkIn, checkOut)
      .then((data) => { setProperty(data); const sel = data.rooms?.find((r) => r.id === roomId); if (sel) setRoom(sel); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));

    return () => { document.body.removeChild(script); };
  }, [propertyId, roomId, checkIn, checkOut, navigate]);

  if (loading || !property || !room) return <div className="p-20 text-center">Loading...</div>;

  const checkInDate = new Date(checkIn! + 'T00:00:00Z');
  const checkOutDate = new Date(checkOut! + 'T00:00:00Z');
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalRoomPrice = room.priceDetails ? room.priceDetails.totalPrice : room.base_price * nights;
  const totalPrice = totalRoomPrice;

  const handleCheckout = async () => {
    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    if (new Date(checkIn! + 'T00:00:00Z') < today) { toast.error('Tanggal check-in tidak boleh di masa lalu.'); return; }
    if (guests.adults < 1) { toast.error('Pemesanan harus menyertakan minimal 1 orang dewasa.'); return; }
    if (guests.adults > room.capacity) { toast.error(`Jumlah orang dewasa tidak boleh melebihi kapasitas kamar (${room.capacity} orang).`); return; }
    if (guests.children > guests.adults) { toast.error(`Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa.`); return; }
    if (guests.babies > guests.adults) { toast.error(`Jumlah bayi tidak boleh melebihi jumlah orang dewasa.`); return; }

    setProcessing(true);
    try {
      const result = await orderService.createOrder({
        propertyId: property.id, roomId: room.id,
        check_in_date: checkIn! + 'T00:00:00Z', check_out_date: checkOut! + 'T00:00:00Z',
        payment_method: paymentMethod, adults: guests.adults, children: guests.children, babies: guests.babies,
      });

      if (paymentMethod === 'MIDTRANS' && result.snapToken) {
        window.snap.pay(result.snapToken, {
          onSuccess: () => navigate('/payment/success'),
          onPending: () => navigate('/payment/success'),
          onError: () => { toast.error('Pembayaran gagal'); navigate('/orders'); },
          onClose: () => { toast('Anda menutup popup tanpa menyelesaikan pembayaran', { icon: '⚠️' }); navigate('/orders'); },
        });
      } else {
        toast.success('Pemesanan berhasil dibuat!');
        navigate('/orders');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>;
      toast.error(axiosError.response?.data?.message || 'Checkout gagal');
    } finally { setProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Selesaikan Pemesanan Anda</h1>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Perjalanan</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Check-in</p>
                <p className="font-semibold text-gray-900 dark:text-white">{checkInDate.toLocaleDateString('id-ID')}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Check-out</p>
                <p className="font-semibold text-gray-900 dark:text-white">{checkOutDate.toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
          <GuestCounter guests={guests} roomCapacity={room.capacity} onUpdate={updateGuest} />
          <PaymentMethodSelector paymentMethod={paymentMethod} onChange={setPaymentMethod} />
        </div>
        <div className="md:col-span-1">
          <BookingSummary property={property} room={room} nights={nights} guests={guests}
            totalPrice={totalPrice} totalRoomPrice={totalRoomPrice} processing={processing} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
