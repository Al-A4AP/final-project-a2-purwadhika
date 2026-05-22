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
import { BedDouble, ArrowLeft, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { toast } from 'react-hot-toast';

import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInfo } from '@/components/property/PropertyInfo';
import { PropertyReviews } from '@/components/property/PropertyReviews';

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
    if (!id) {
      navigate('/');
      return;
    }
    const hasValidDates = checkIn && checkOut && new Date(checkOut) > new Date(checkIn);

    Promise.resolve().then(() => {
      setLoading(true);
    });

    Promise.all([
      propertyService.getPropertyDetail(
        id,
        hasValidDates ? checkIn : undefined,
        hasValidDates ? checkOut : undefined
      ),
      reviewService.getPropertyReviews(id)
    ])
      .then(([propData, reviewData]) => {
        setProperty(propData);
        setReviews(reviewData);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate, checkIn, checkOut]);

  const handleBooking = (room: Room) => {
    setDateError('');
    if (!checkIn || !checkOut) {
      setDateError('Silakan pilih tanggal check-in dan check-out terlebih dahulu.');
      document.getElementById('date-picker-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    if (checkIn < todayStr) {
      setDateError('Tanggal check-in tidak boleh di masa lalu.');
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
      toast.error('Gagal mengambil data ketersediaan');
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
        <PropertyGallery
          featuredImageUrl={property.featured_image_url || ''}
          name={property.name}
          images={property.images}
        />

        {/* Info */}
        <PropertyInfo
          categoryName={property.category?.name}
          name={property.name}
          address={property.address}
          city={property.city}
          minPrice={property.min_price}
          description={property.description}
        />

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
              <p className="mt-3 text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle size={16} /> {dateError}
              </p>
            )}
            {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
              <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
                Terpilih: {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)} malam
              </p>
            )}
          </div>
        )}

        {/* Rooms / Whole Property */}
        {(() => {
          const isWholeUnit = ['Villa', 'Rumah'].includes(property.category?.name || '');
          const firstRoom = property.rooms?.[0];

          if (isWholeUnit && firstRoom) {
            const firstRoomPrice = firstRoom.priceDetails ? firstRoom.priceDetails.totalPrice : firstRoom.base_price;
            return (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border dark:border-slate-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {property.category?.name === 'Villa' ? 'Sewa Seluruh Villa' : 'Sewa Seluruh Rumah'}
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
                    {firstRoomPrice === 0 ? (
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">Gratis</p>
                    ) : (
                      <p className="text-3xl font-bold text-red-600">{formatPrice(firstRoomPrice)}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {firstRoom.priceDetails ? `total (${firstRoom.priceDetails.nights} malam)` : '/ malam (seluruh unit)'}
                    </p>
                    {firstRoom.priceDetails && firstRoom.priceDetails.nights > 1 && firstRoomPrice > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Rata-rata: {formatPrice(Math.round(firstRoomPrice / firstRoom.priceDetails.nights))} / malam
                      </p>
                    )}
                  </div>
                </div>

                {firstRoom.priceDetails && (
                  <div className="mt-6 text-sm bg-gray-50 dark:bg-slate-700/30 p-4 rounded-lg space-y-1 border dark:border-slate-750">
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Rincian Harga Menginap:</p>
                    {firstRoom.priceDetails.breakdown.map((day, idx) => (
                      <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-400 py-1 border-b border-gray-100 dark:border-slate-700/50 last:border-0">
                        <span className="flex items-center gap-2">
                          {day.date} 
                          {day.isPeak && (
                            <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 px-2 py-0.5 rounded font-semibold">
                              {day.rateName || 'Peak Season'}
                            </span>
                          )}
                        </span>
                        <span className="font-medium">{day.price === 0 ? 'Gratis' : formatPrice(day.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {firstRoom.is_available === false && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-1.5">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <span>{firstRoom.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
                  </div>
                )}

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
                      disabled={firstRoom.is_available === false}
                      className={`flex-1 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm ${
                        firstRoom.is_available === false
                          ? 'bg-gray-400 dark:bg-slate-700 cursor-not-allowed text-gray-200'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {firstRoom.is_available === false ? 'Tidak Tersedia' : 'Pesan Sekarang'}
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
                {property.rooms?.map((room) => {
                  const roomPrice = room.priceDetails ? room.priceDetails.totalPrice : room.base_price;
                  return (
                    <div key={room.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{room.room_type}</h3>
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1"><BedDouble size={16} /> Kapasitas: {room.capacity}</span>
                        </div>
                        {room.description && <p className="text-sm text-gray-500 mb-4">{room.description}</p>}
                      </div>

                      {room.priceDetails && (
                        <div className="mt-4 text-xs bg-gray-50 dark:bg-slate-700/30 p-3 rounded-lg space-y-1 mb-4 border dark:border-slate-750">
                          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Rincian Harga Menginap:</p>
                          {room.priceDetails.breakdown.map((day, idx) => (
                            <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-400 py-0.5 border-b border-gray-100 dark:border-slate-700/50 last:border-0">
                              <span className="flex items-center gap-1">
                                {day.date} 
                                {day.isPeak && (
                                  <span className="text-[9px] bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 px-1 rounded font-semibold">
                                    {day.rateName || 'Peak Season'}
                                  </span>
                                )}
                              </span>
                              <span className="font-medium">{day.price === 0 ? 'Gratis' : formatPrice(day.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {room.is_available === false && (
                        <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs flex items-start gap-1.5">
                          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                          <span>{room.reason || 'Kamar tidak tersedia pada tanggal yang dipilih.'}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t dark:border-slate-700 flex items-center justify-between mt-auto">
                        <div>
                          {roomPrice === 0 ? (
                            <p className="font-bold text-lg text-green-600 dark:text-green-400">Gratis</p>
                          ) : (
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(roomPrice)}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {room.priceDetails ? `total (${room.priceDetails.nights} malam)` : '/ malam'}
                          </p>
                          {room.priceDetails && room.priceDetails.nights > 1 && roomPrice > 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Rata-rata: {formatPrice(Math.round(roomPrice / room.priceDetails.nights))}
                            </p>
                          )}
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
                              disabled={room.is_available === false}
                              className={`px-6 py-2 rounded-lg font-medium transition text-sm ${
                                room.is_available === false
                                  ? 'bg-gray-400 dark:bg-slate-700 text-gray-200 cursor-not-allowed'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {room.is_available === false ? 'Penuh' : 'Pesan'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Reviews */}
        <PropertyReviews reviews={reviews} />
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
