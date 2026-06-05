import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Building2, Home, Tent, MapPin, ShieldCheck, CalendarClock, CreditCard, ChevronRight } from "lucide-react";
import { useHomePageState } from "./home/useHomePageState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { EmptyState } from "@/components/common/EmptyState";

const CITIES = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Denpasar", "Medan", "Makassar", "Malang"];
const CATEGORIES = [
  { name: "Hotel", icon: Building2 },
  { name: "Apartment", icon: Building2 },
  { name: "Kost", icon: Home },
  { name: "House", icon: Home },
  { name: "Villa", icon: Tent },
];

const HomePage: FC = () => {
  const { propertyState } = useHomePageState();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
      {/* Hero Section */}
      <section className="relative h-150 w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent"></div>
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center">
          <span className="mb-4 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wider text-white backdrop-blur-md">PURWALOKA</span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl text-balance">Temukan Tempat Menginap Terbaik di Indonesia</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">Bandingkan harga, cek ketersediaan kamar, dan pesan hotel, apartemen, kost, rumah, atau villa dengan pengalaman yang cepat dan nyaman.</p>
          
          <form onSubmit={handleSearch} className="mt-10 flex w-full max-w-4xl flex-col gap-2 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:bg-slate-800/95 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center px-4 py-2">
              <MapPin className="mr-3 text-slate-400" />
              <div className="flex w-full flex-col text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Destinasi</span>
                <input type="text" placeholder="Mau ke mana?" className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
              </div>
            </div>
            <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-700 sm:block"></div>
            <div className="flex flex-1 items-center px-4 py-2">
              <CalendarClock className="mr-3 text-slate-400" />
              <div className="flex w-full flex-col text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Check-in</span>
                <input type="text" placeholder="Kapan?" className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-white" />
              </div>
            </div>
            <button type="submit" className="flex h-14 w-full items-center justify-center rounded-xl bg-red-600 px-8 font-semibold text-white transition hover:bg-red-700 sm:w-auto">
              <Search className="mr-2 h-5 w-5" /> Cari
            </button>
          </form>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Kategori Properti</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/explore?category=${cat.name}`} className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
              <cat.icon className="mb-3 h-8 w-8 text-slate-400 group-hover:text-red-600 transition-colors" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Properti Unggulan</h2>
            <p className="mt-1 text-slate-500">Rekomendasi terbaik untuk Anda.</p>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-red-600 hover:text-red-700">Lihat Semua <ChevronRight className="inline h-4 w-4" /></Link>
        </div>
        {propertyState.loading ? (
          <SectionLoading variant="cards" />
        ) : propertyState.properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Will use existing Safe Fallback or PropertyCard later, for now safe shell */}
            {propertyState.properties.slice(0, 4).map((p) => (
               <div key={p.id} className="h-64 rounded-2xl bg-white shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-800 overflow-hidden flex flex-col">
                 {p.featured_image_url ? (
                   <img src={p.featured_image_url} alt={p.name} className="h-40 w-full object-cover" />
                 ) : (
                   <div className="h-40 w-full bg-slate-200 dark:bg-slate-700"></div>
                 )}
                 <div className="p-4">
                   <h3 className="font-bold text-slate-900 dark:text-white truncate">{p.name}</h3>
                   <p className="text-sm text-slate-500">{p.city}</p>
                 </div>
               </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada properti" />
        )}
      </section>

      {/* Popular Cities */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Destinasi Populer</h2>
        <div className="flex flex-wrap gap-3">
          {CITIES.map((city) => (
            <Link key={city} to={`/explore?city=${city}`} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-red-600 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-600">
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl bg-slate-900 px-6 py-16 text-center text-white sm:px-12 lg:px-24">
          <h2 className="mb-12 text-3xl font-bold">Mengapa Memilih Kami?</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md"><Search className="h-6 w-6 text-red-500" /></div>
              <h3 className="font-bold">Bandingkan Harga</h3>
              <p className="mt-2 text-sm text-slate-400">Temukan harga terbaik dari ribuan properti.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md"><CalendarClock className="h-6 w-6 text-red-500" /></div>
              <h3 className="font-bold">Ketersediaan Real-time</h3>
              <p className="mt-2 text-sm text-slate-400">Informasi kalender ketersediaan yang selalu update.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md"><ShieldCheck className="h-6 w-6 text-red-500" /></div>
              <h3 className="font-bold">Tenant Terverifikasi</h3>
              <p className="mt-2 text-sm text-slate-400">Keamanan terjamin dengan verifikasi host ketat.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md"><CreditCard className="h-6 w-6 text-red-500" /></div>
              <h3 className="font-bold">Reservasi Aman</h3>
              <p className="mt-2 text-sm text-slate-400">Transaksi dilindungi sistem keamanan berstandar tinggi.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
