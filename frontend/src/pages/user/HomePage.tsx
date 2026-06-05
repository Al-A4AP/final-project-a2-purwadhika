import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  ChevronRight,
  CreditCard,
  Home,
  Search,
  ShieldCheck,
  Tent,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { HeroSection } from "@/components/user/HeroSection";
import PropertyCard from "@/components/user/PropertyCard";
import SearchForm from "@/components/user/SearchForm";
import { PROPERTY_CATEGORIES } from "@/lib/constants";
import type { Property } from "@/types";
import { useHomePageState } from "./home/useHomePageState";

const FEATURED_LIMIT = 4;
const POPULAR_CITIES = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Denpasar", "Medan", "Makassar", "Malang"];
const CATEGORY_ICONS: Record<string, LucideIcon> = { Apartemen: Building2, Hotel: Building2, Kost: Home, Rumah: Home, Villa: Tent };
const TRUST_ITEMS = [
  { icon: Search, title: "Bandingkan Harga", text: "Temukan harga terbaik dari ribuan properti." },
  { icon: CalendarClock, title: "Ketersediaan Real-time", text: "Informasi kalender ketersediaan yang selalu update." },
  { icon: ShieldCheck, title: "Tenant Terverifikasi", text: "Keamanan terjamin dengan verifikasi host ketat." },
  { icon: CreditCard, title: "Reservasi Aman", text: "Transaksi dilindungi sistem keamanan berstandar tinggi." },
];

type PropertyState = ReturnType<typeof useHomePageState>["propertyState"];
type HomePageState = ReturnType<typeof useHomePageState>;

const HomePage: FC = () => <HomePageView state={useHomePageState()} />;

const HomePageView: FC<{ state: HomePageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-900">
    <HomeHero />
    <CategoryHighlights />
    <FeaturedProperties city={state.activeFilters.city} state={state.propertyState} />
    <PopularCities />
    <TrustSection />
    <TenantCta />
  </div>
);

const HomeHero: FC = () => (
  <section className="relative">
    <HeroSection />
    <div className="relative z-30 mx-auto -mt-20 max-w-5xl px-4 pb-8 md:-mt-24">
      <SearchForm submitMode="explore" />
    </div>
  </section>
);

const CategoryHighlights: FC = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Kategori Properti</h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {PROPERTY_CATEGORIES.map((category) => <CategoryCard key={category.id} name={category.name} />)}
    </div>
  </section>
);

const CategoryCard: FC<{ name: string }> = ({ name }) => {
  const Icon = CATEGORY_ICONS[name] || Building2;
  return (
    <Link to={`/explore?category=${encodeURIComponent(name)}`} className="group flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white py-8 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800">
      <Icon className="mb-3 h-8 w-8 text-slate-400 transition-colors group-hover:text-red-600" />
      <span className="font-semibold text-slate-700 dark:text-slate-200">{name}</span>
    </Link>
  );
};

const FeaturedProperties: FC<{ city: string; state: PropertyState }> = ({ city, state }) => (
  <section id="results-section" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-8">
    <FeaturedHeader city={city} />
    <FeaturedContent state={state} />
  </section>
);

const FeaturedHeader: FC<{ city: string }> = ({ city }) => (
  <div className="mb-8 flex items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{featuredTitle(city)}</h2>
      <p className="mt-1 text-slate-500">{featuredSubtitle(city)}</p>
    </div>
    <Link to="/explore" className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-700">
      Lihat Semua <ChevronRight className="inline h-4 w-4" />
    </Link>
  </div>
);

const featuredTitle = (city: string) =>
  city ? `Properti Terdekat di ${city}` : "Properti Terdekat";

const featuredSubtitle = (city: string) =>
  city ? "Rekomendasi berdasarkan lokasi Anda." : "Aktifkan lokasi untuk rekomendasi yang lebih dekat.";

const FeaturedContent: FC<{ state: PropertyState }> = ({ state }) => {
  if (state.loading) return <SectionLoading variant="cards" />;
  if (!state.properties.length) return <EmptyState title="Belum ada properti" />;
  return <FeaturedGrid properties={state.properties.slice(0, FEATURED_LIMIT)} />;
};

const FeaturedGrid: FC<{ properties: Property[] }> = ({ properties }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
  </div>
);

const PopularCities: FC = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">Destinasi Populer</h2>
    <div className="flex flex-wrap gap-3">
      {POPULAR_CITIES.map((city) => <CityLink key={city} city={city} />)}
    </div>
  </section>
);

const CityLink: FC<{ city: string }> = ({ city }) => (
  <Link to={`/explore?city=${encodeURIComponent(city)}`} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-red-600 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-600">
    {city}
  </Link>
);

const TrustSection: FC = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <div className="rounded-3xl bg-slate-900 px-6 py-16 text-center text-white sm:px-12 lg:px-24">
      <h2 className="mb-12 text-3xl font-bold">Mengapa Memilih Kami?</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => <TrustItem key={item.title} {...item} />)}
      </div>
    </div>
  </section>
);

const TrustItem: FC<{ icon: LucideIcon; text: string; title: string }> = ({ icon: Icon, text, title }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4 rounded-full bg-white/10 p-4 backdrop-blur-md"><Icon className="h-6 w-6 text-red-500" /></div>
    <h3 className="font-bold">{title}</h3>
    <p className="mt-2 text-sm text-slate-400">{text}</p>
  </div>
);

const TenantCta: FC = () => (
  <section className="mx-auto max-w-7xl px-4 py-12">
    <div className="flex flex-col gap-6 rounded-2xl border border-red-100 bg-white p-8 shadow-sm dark:border-red-900/30 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ayo daftar sebagai tenant</h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">Kelola properti, kamar, harga musiman, dan reservasi tamu dari satu dashboard.</p>
      </div>
      <Link to="/auth/register/tenant" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 sm:w-fit lg:shrink-0">
        Mulai Menjadi Tenant <ArrowRight size={16} />
      </Link>
    </div>
  </section>
);

export default HomePage;
