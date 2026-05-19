import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyService } from '@/services/propertyService';
import { useFilterStore } from '@/stores/filterStore';
import type { PropertyDetail, Room } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { MapPin, BedDouble, ArrowLeft } from 'lucide-react';

const PropertyDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const filters = useFilterStore();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    propertyService.getPropertyDetail(id)
      .then(setProperty)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBooking = (room: Room) => {
    if (!filters.check_in_date || !filters.check_out_date) {
      alert('Silakan pilih tanggal check-in dan check-out di filter terlebih dahulu');
      return;
    }
    // Navigate to booking page passing the property and room info
    navigate(`/booking?propertyId=${id}&roomId=${room.id}&checkIn=${filters.check_in_date}&checkOut=${filters.check_out_date}`);
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

        {/* Rooms */}
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
                <button
                  onClick={() => handleBooking(room)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Pesan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
