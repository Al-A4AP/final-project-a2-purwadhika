import type { FC } from 'react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { searchFormSchema, type SearchFormInput } from '@/validations/search';
import { useFilterStore } from '@/stores/filterStore';
import { CITIES } from '@/lib/constants';
import { formatDateForInput } from '@/lib/formatters';

const SearchForm: FC = () => {
  const filters = useFilterStore();

  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormInput>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      city: filters.city || '',
      check_in_date: filters.check_in_date || '',
      check_out_date: filters.check_out_date || '',
      capacity: filters.capacity || 1,
    },
  });

  const { today, tomorrow } = useMemo(() => {
    const now = new Date();
    return {
      today: formatDateForInput(now),
      tomorrow: formatDateForInput(new Date(now.getTime() + 86400000)),
    };
  }, []);

  const onSubmit = (data: SearchFormInput) => {
    filters.setCity(data.city);
    filters.setCheckInDate(data.check_in_date);
    filters.setCheckOutDate(data.check_out_date);
    filters.setCapacity(data.capacity);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline mr-1" size={16} /> Kota
            </label>
            <select
              {...register('city')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">Pilih kota</option>
              {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} /> Check-in
            </label>
            <input type="date" {...register('check_in_date')} min={today}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            {errors.check_in_date && <p className="text-red-500 text-xs mt-1">{errors.check_in_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} /> Check-out
            </label>
            <input type="date" {...register('check_out_date')} min={tomorrow}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            {errors.check_out_date && <p className="text-red-500 text-xs mt-1">{errors.check_out_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline mr-1" size={16} /> Orang
            </label>
            <input type="number" {...register('capacity')} min="1" max="20"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
            {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
          </div>

          <button type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Search size={18} /> Cari
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
