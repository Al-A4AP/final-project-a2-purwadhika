import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import SearchForm from './SearchForm';
import { useFilterStore } from '@/stores/filterStore';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    title: 'Sewa Penginapan Terbaik untuk Liburan Anda',
    subtitle: 'Temukan hotel, resort, apartemen, villa dan kost di kota-kota terpopuler Indonesia',
  },
  {
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    title: 'Nikmati Keindahan & Ketenangan Alam',
    subtitle: 'Vila mewah eksklusif dengan privasi penuh dan fasilitas kolam renang kelas dunia',
  },
  {
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    title: 'Kemewahan Modern di Pusat Kota',
    subtitle: 'Apartemen elegan dengan pemandangan cakrawala metropolitan yang menakjubkan',
  },
];

const TRENDING_DESTINATIONS = [
  {
    city: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    count: '120+ Properti',
  },
  {
    city: 'Jakarta',
    image: 'https://images.unsplash.com/photo-1506485338023-6ce5f36692df?auto=format&fit=crop&w=600&q=80',
    count: '85+ Properti',
  },
  {
    city: 'Bandung',
    image: 'https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&w=600&q=80',
    count: '60+ Properti',
  },
  {
    city: 'Yogyakarta',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=600&q=80',
    count: '45+ Properti',
  },
];

export const HeroSection: FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const filters = useFilterStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleSelectCity = (city: string) => {
    filters.setCity(city);
    // Smooth scroll to results
    document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full">
      {/* Visual Image Carousel Banner */}
      <div className="relative h-137.5 md:h-150 w-full overflow-hidden bg-slate-900">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/45 z-10" />
            <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-6000"
            />
            {/* Caption */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 mb-20 md:mb-12">
              <span className="flex items-center gap-1.5 text-red-500 font-semibold text-xs md:text-sm tracking-wider uppercase bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-4 animate-fade-in-down border border-white/20">
                <Sparkles size={14} className="text-red-500 fill-red-500" />
                PropRent Premium Vacation Homes
              </span>
              <h1 className="text-3xl md:text-6xl font-bold text-white max-w-4xl leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-sm md:text-xl text-gray-250 text-white/90 max-w-2xl mt-4 drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Carousel Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/15 dark:bg-slate-900/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/30 transition"
          aria-label="Slide Sebelumnya"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/15 dark:bg-slate-900/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/30 transition"
          aria-label="Slide Selanjutnya"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-red-600' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Pilih slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Search Form Wrapper */}
      <div className="relative -mt-20 md:-mt-24 z-40 max-w-7xl mx-auto px-4">
        <div className="bg-white/85 dark:bg-slate-800/85 backdrop-blur-xl p-2.5 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-750/30">
          <SearchForm />
        </div>
      </div>

      {/* Trending Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="inline-block w-2.5 h-6 bg-red-600 rounded-full"></span>
              Destinasi Populer yang Sedang Tren
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Rekomendasi kota terbaik di Indonesia untuk liburan tak terlupakan Anda berikutnya
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {TRENDING_DESTINATIONS.map((dest) => (
            <button
              key={dest.city}
              onClick={() => handleSelectCity(dest.city)}
              className="group relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md text-left transition duration-300 hover:shadow-xl hover:-translate-y-1 outline-none focus:ring-2 focus:ring-red-500"
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent z-10 transition-opacity duration-300 group-hover:from-black/90" />
              <img
                src={dest.image}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-20">
                <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold tracking-widest uppercase mb-1">
                  <MapPin size={10} /> {dest.count}
                </span>
                <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-red-200 transition">
                  {dest.city}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
