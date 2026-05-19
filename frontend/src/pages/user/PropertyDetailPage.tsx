import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { useFilterStore } from '@/stores/filterStore';
import { reviewService } from '@/services/reviewService';
import { availabilityService } from '@/services/availabilityService';
import type { PropertyDetail, Room, Review } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { useAuthStore } from '@/stores/authStore';
import { MapPin, BedDouble, ArrowLeft, Star, User, Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';


// rkor 300 brs lebih ini, bantu dipecah

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const filters = useFilterStore();
  const { isTenant } = useAuthStore();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Local date state — pre-filled dari filterStore jika sudah ada
  const [checkIn, setCheckIn] = useState(filters.check_in_date || '');
  const [checkOut, setCheckOut] = useState(filters.check_out_date || '');
  const [dateError, setDateError] = useState('');
  
  const [isAvailModalOpen, setIsAvailModalOpen] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);

  useEffect(() => {
    Promise.all([
      propertyService.getPropertyDetail(id),
      reviewService.getPropertyReviews(id)
    ])
      .then(([propData, reviewData]) => {
        setProperty(propData);
        setReviews(reviewData);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBooking = (room: Room) => {
    setDateError('');
    if (!checkIn || !checkOut) {
      setDateError('Silakan pilih tanggal check-in dan check-out terlebih dahulu.');
      document.getElementById('date-picker-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setDateError('Tanggal check-out harus setelah check-in.');
      return;
    }
    // Simpan ke filterStore agar tersinkron
    filters.setCheckInDate(checkIn);
    filters.setCheckOutDate(checkOut);
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  const handleCheckAvail = async (room: Room) => {
    setSelectedRoomName(room.room_type);
    try {
      const data = await availabilityService.getRoomAvailability(room.id);
      setBlockedDays(data.filter(a => !a.is_available).map(a => new Date(a.date)));
      setIsAvailModalOpen(true);
    } catch {
      alert('Gagal mengambil data ketersediaan');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-64 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-10 w-1/3 bg-gray-200 dark:bg-slate-800 rounded"></div>
        <div className="h-40 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6 hover:text-red-600">
          <ArrowLeft size={20} /> Kembali
        </button>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img src={property.featured_image_url || ''} alt={property.name} className="w-full h-80 object-cover rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {property.images?.slice(0, 4).map((img, i) => (
              <img key={i} src={img.image_url} alt="" className="w-full h-[152px] object-cover rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                {property.category?.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{property.name}</h1>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-2">
                <MapPin size={18} /> {property.address}, {property.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Mulai dari</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(property.min_price)}</p>
              <p className="text-sm text-gray-500">/ malam</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tentang Properti</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>

        {/* Date Picker Section */}
        {!isTenant && (
          <div id="date-picker-section" className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal Menginap
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setCheckIn(e.target.value); setDateError(''); }}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setCheckOut(e.target.value); setDateError(''); }}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
            {dateError && (
              <p className="mt-3 text-sm text-red-500 flex items-center gap-1">⚠️ {dateError}</p>
            )}
            {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
                ✅ {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)} malam dipilih
              </p>
            )}
          </div>
        )}

        {/* Rooms / Whole Property */}
        {(() => {
          const isWholeUnit = ['Villa', 'Rumah'].includes(property.category?.name || '');
          const firstRoom = property.rooms?.[0];

          if (isWholeUnit && firstRoom) {
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {property.category?.name === 'Villa' ? '🏡 Sewa Seluruh Villa' : '🏠 Sewa Seluruh Rumah'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Anda akan menyewa seluruh {property.category?.name?.toLowerCase()} ini secara eksklusif.
                </p>
                <div className="flex flex-wrap gap-6 items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1"><BedDouble size={16} /> Kapasitas: {firstRoom.capacity} orang</span>
                    </div>
                    {firstRoom.description && <p className="text-sm text-gray-500">{firstRoom.description}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-600">{formatPrice(firstRoom.base_price)}</p>
                    <p className="text-sm text-gray-500">/ malam (seluruh unit)</p>
                  </div>
                </div>
                {!isTenant && (
                  <div className="flex gap-3 mt-6 border-t dark:border-slate-700 pt-6">
                    {!isTenant && (
                      <button
                        onClick={() => handleCheckAvail(firstRoom)}
                        className="flex items-center gap-2 px-4 py-2.5 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm"
                      >
                        <CalendarIcon size={16} /> Cek Ketersediaan
                      </button>
                    )}
                    <button
                      onClick={() => handleBooking(firstRoom)}
                      className="flex-1 bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pilihan Kamar</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {property.rooms?.map((room) => (
                  <div key={room.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{room.room_type}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><BedDouble size={16} /> Kapasitas: {room.capacity}</span>
                      </div>
                      {room.description && <p className="text-sm text-gray-500 mb-4">{room.description}</p>}
                    </div>
                    <div className="pt-4 border-t dark:border-slate-700 flex items-center justify-between mt-auto">
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(room.base_price)}</p>
                        <p className="text-xs text-gray-500">/ malam</p>
                      </div>
                      <div className="flex gap-2">
                        {!isTenant && (
                          <button
                            onClick={() => handleCheckAvail(room)}
                            className="p-2 border dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                            title="Cek Ketersediaan"
                          >
                            <CalendarIcon size={18} />
                          </button>
                        )}
                        {!isTenant && (
                          <button
                            onClick={() => handleBooking(room)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                          >
                            Pesan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {/* Reviews */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-12">Ulasan Tamu</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">Belum ada ulasan untuk properti ini.</p>
          ) : reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                  {review.user?.avatar_url ? <img src={review.user.avatar_url} alt="" /> : <User size={20} className="text-gray-500" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={14} fill="currentColor" /> {review.rating}/5
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
              
              {/* Replies */}
              {review.replies && review.replies.map(reply => (
                <div key={reply.id} className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg ml-6">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Balasan dari Pemilik:</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{reply.reply_text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Avail Modal */}
      {isAvailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Ketersediaan Kamar</h2>
            <p className="text-sm text-gray-500 mb-4">{selectedRoomName}</p>
            <div className="flex justify-center bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <DayPicker
                
                disabled={[{ before: new Date() }, ...blockedDays]}
                modifiers={{ blocked: blockedDays }}
                modifiersStyles={{
                  blocked: { backgroundColor: '#ef4444', color: 'white', textDecoration: 'line-through' }
                }}
              />
            </div>
            <p className="text-xs text-center text-red-500 mt-2">Tanggal yang dicoret berarti penuh/tidak tersedia.</p>
            <div className="flex justify-end mt-6">
              <button onClick={() => setIsAvailModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
