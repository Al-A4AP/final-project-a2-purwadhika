import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { orderService } from '@/services/orderService';
import type { PropertyDetail, Room, ApiResponse } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { CreditCard, Wallet } from 'lucide-react';
import type { AxiosError } from 'axios';

// ini juga 200, nanti kt diskusi lg
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: Record<string, unknown>) => void;
    };
  }
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
    setGuests((prev) => {
      const next = { ...prev, [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta) };
      return next;
    });
  };

  const totalGuests = guests.adults + guests.children;

  useEffect(() => {
    if (!propertyId || !roomId || !checkIn || !checkOut) {
      navigate('/');
      return;
    }
    
    // Load Midtrans Snap script dynamically
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    // Gunakan environment variable untuk client key di produksi (vite)
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);

    propertyService.getPropertyDetail(propertyId)
      .then((data) => {
        setProperty(data);
        const selectedRoom = data.rooms?.find(r => r.id === roomId);
        if (selectedRoom) setRoom(selectedRoom);
      })
      .finally(() => setLoading(false));

    return () => {
      document.body.removeChild(script);
    };
  }, [propertyId, roomId, checkIn, checkOut, navigate]);

  if (loading || !property || !room) return <div className="p-20 text-center">Loading...</div>;

  const checkInDate = new Date(checkIn!);
  const checkOutDate = new Date(checkOut!);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = room.base_price * nights;

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const result = await orderService.createOrder({
        propertyId: property.id,
        roomId: room.id,
        check_in_date: new Date(checkIn!).toISOString(),
        check_out_date: new Date(checkOut!).toISOString(),
        payment_method: paymentMethod
      });

      if (paymentMethod === 'MIDTRANS' && result.snapToken) {
        window.snap.pay(result.snapToken, {
          onSuccess: function() {
            navigate('/orders');
          },
          onPending: function() {
            navigate('/orders');
          },
          onError: function() {
            alert('Pembayaran gagal');
            navigate('/orders');
          },
          onClose: function() {
            alert('Anda menutup popup tanpa menyelesaikan pembayaran');
            navigate('/orders');
          }
        });
      } else {
        navigate('/orders'); // Redirect to orders to upload manual proof
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse<null>>;
      alert(axiosError.response?.data?.message || 'Checkout gagal');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Detail Form */}
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

          {/* Tamu */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detail Tamu</h2>
            <div className="space-y-4">
              {(([
                { key: 'adults', label: 'Dewasa', desc: 'Usia 13 tahun ke atas' },
                { key: 'children', label: 'Anak-anak', desc: 'Usia 2 - 12 tahun' },
                { key: 'babies', label: 'Bayi', desc: 'Di bawah 2 tahun' },
              ]) as { key: 'adults' | 'children' | 'babies'; label: string; desc: string }[]).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => updateGuest(key, -1)}
                      className="w-8 h-8 rounded-full border dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition"
                      disabled={guests[key] <= (key === 'adults' ? 1 : 0)}
                    >−</button>
                    <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">{guests[key]}</span>
                    <button type="button" onClick={() => updateGuest(key, 1)}
                      className="w-8 h-8 rounded-full border dark:border-slate-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-lg transition"
                    >+</button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 border-t dark:border-slate-700 pt-3">
                Total tamu: <strong>{totalGuests} orang</strong>{guests.babies > 0 ? ` + ${guests.babies} bayi` : ''}
              </p>
            </div>
          </div>


          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Metode Pembayaran</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'MIDTRANS' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'MIDTRANS'} onChange={() => setPaymentMethod('MIDTRANS')} className="text-red-600 focus:ring-red-500" />
                <CreditCard className={paymentMethod === 'MIDTRANS' ? 'text-red-600' : 'text-gray-400'} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Bayar Otomatis (Midtrans)</p>
                  <p className="text-sm text-gray-500">Kartu Kredit, GoPay, BCA Virtual Account, dll.</p>
                </div>
              </label>
              
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'MANUAL' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-slate-700'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'MANUAL'} onChange={() => setPaymentMethod('MANUAL')} className="text-red-600 focus:ring-red-500" />
                <Wallet className={paymentMethod === 'MANUAL' ? 'text-red-600' : 'text-gray-400'} />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Transfer Manual</p>
                  <p className="text-sm text-gray-500">Transfer ke rekening bank dan unggah bukti pembayaran.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border dark:border-slate-700 sticky top-24">
            <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Ringkasan Pesanan</h2>
            
            <div className="flex gap-4 mb-6">
              <img src={property.featured_image_url || ''} alt="Property" className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{property.name}</p>
                <p className="text-xs text-gray-500">{room.room_type}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm mb-6 border-y dark:border-slate-700 py-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{formatPrice(room.base_price)} x {nights} malam</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-red-600">{formatPrice(totalPrice)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-70"
            >
              {processing ? 'Memproses...' : 'Lanjutkan Pembayaran'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;
