import type { FC } from 'react';
import { ArrowRight, ShieldCheck, Lock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const impactStats = [
  { value: 'Rp 50M+', label: 'Kontribusi pada Ekonomi Lokal' },
  { value: '15.000+', label: 'Pemilik Properti Terbantu' },
  { value: '2 Juta+', label: 'Pemesanan Berhasil' },
];

const communityStories = [
  {
    name: 'Ibu Kusuma',
    location: 'Ubud, Bali',
    quote: '"Berkat PURWALOKA, kamar kosong di rumah kami kini menjadi sumber pendapatan utama untuk membiayai pendidikan anak-anak kami."',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
  },
  {
    name: 'Dimas Pratama',
    location: 'Yogyakarta',
    quote: '"Platform ini memungkinkan saya memulai bisnis penginapan kecil-kecilan tanpa modal pemasaran yang besar. Sangat mudah digunakan."',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  },
  {
    name: 'Keluarga Siregar',
    location: 'Bandung',
    quote: '"Setiap akhir pekan kami selalu mengandalkan PURWALOKA untuk mencari villa liburan yang ramah keluarga dan terverifikasi aman."',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop',
  },
];

const AboutPage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      
      {/* Hero Section - TikTok Corporate Style */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
            <span className="text-rose-600">PURWA</span><span className="text-slate-900 dark:text-white">LOKA</span> is Indonesia's leading destination for authentic stays.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            Misi kami adalah menangkap dan menyajikan kreativitas, kenyamanan, serta momen yang berarti dalam perjalanan Anda. PURWALOKA memberdayakan setiap orang untuk menjadi tuan rumah (*host*) langsung dari ponsel mereka, dan berkomitmen membangun komunitas yang saling percaya.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8"></div>

      {/* Our Impact Section */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">Dampak Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {impactStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="text-5xl font-black text-rose-600 mb-4">{stat.value}</span>
              <span className="text-lg font-medium text-slate-900 dark:text-slate-100">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PURWALOKA for Good / Mission */}
      <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-900 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              <span className="text-rose-600">PURWA</span><span className="text-slate-900 dark:text-white">LOKA</span> for Good
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Kami memicu dialog yang bermakna, memberdayakan ekonomi lokal, dan mengubah aset properti menjadi dampak nyata di dunia nyata di seluruh komunitas global kami.
            </p>
            <Link to="/" className="inline-flex items-center text-rose-600 font-bold hover:text-rose-700 transition-colors text-lg group">
              Temukan lebih lanjut 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-video relative">
            <img 
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80" 
              alt="Community impact" 
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Menciptakan lingkungan yang ramah di mana semua orang merasa aman adalah prioritas tertinggi kami.
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Kami memberdayakan komunitas kami dengan serangkaian alat untuk mengontrol dan mengelola privasi, keamanan, serta transaksi mereka di platform kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <ShieldCheck size={32} className="text-slate-900 dark:text-white" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Properti Terverifikasi</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Tim kami melakukan kurasi dan verifikasi pada setiap properti untuk memastikan apa yang Anda lihat adalah apa yang akan Anda dapatkan.
            </p>
          </div>
          <div className="space-y-4">
            <Lock size={32} className="text-slate-900 dark:text-white" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privasi & Keamanan Data</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Kami menjunjung tinggi prinsip privasi saat kami terus membangun secara bertanggung jawab, adil, dan terbuka.
            </p>
          </div>
          <div className="space-y-4">
            <Users size={32} className="text-slate-900 dark:text-white" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Transaksi Terlindungi</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Integrasi pembayaran kami (Midtrans) memastikan dana Anda aman hingga masa menginap Anda terkonfirmasi selesai.
            </p>
          </div>
        </div>
      </section>

      {/* Built on PURWALOKA (Community Stories) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-4">Komunitas</h2>
        <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-16 max-w-2xl">
          Built on PURWALOKA: Merayakan Komunitas Pemilik Properti Lokal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communityStories.map((story, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-4/5 rounded-xl overflow-hidden mb-6">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{story.name}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium uppercase tracking-wider">{story.location}</p>
              <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                {story.quote}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900 text-white py-24 px-6 text-center mt-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">Siap Memulai Perjalanan Anda?</h2>
        <div className="flex justify-center gap-4">
          <Link to="/" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors">
            Cari Properti
          </Link>
          <Link to="/auth/register/tenant" className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
            Menjadi Tenant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
