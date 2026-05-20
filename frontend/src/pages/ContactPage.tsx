import type { FC } from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Plus, Minus } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'info@purwaloka.com', desc: 'Kami akan merespons dalam 1x24 jam.' },
  { icon: Phone, label: 'Telepon / WhatsApp', value: '+62 819 0933 3337', desc: 'Senin - Jumat, pukul 08:00 - 20:00 WIB.' },
  { icon: MapPin, label: 'Kantor Pusat', value: 'Jl. Buah Batu No.55', desc: 'Bandung, Jawa Barat 40265, Indonesia.' },
];

const faqs = [
  { q: 'Bagaimana cara memesan properti di PURWALOKA?', a: 'Sangat mudah! Gunakan fitur pencarian di beranda untuk menemukan properti, pilih tanggal yang tersedia di kalender properti, klik pesan, lalu selesaikan pembayaran melalui Midtrans. Konfirmasi otomatis akan dikirim ke email Anda.' },
  { q: 'Apakah pembayaran saya dijamin aman?', a: 'Sangat aman. Kami menggunakan Midtrans sebagai payment gateway tersertifikasi. Dana Anda akan dilindungi dan baru akan diteruskan ke pemilik properti setelah pesanan terkonfirmasi selesai.' },
  { q: 'Bagaimana prosedur pembatalan pesanan?', a: 'Anda dapat mengajukan pembatalan melalui menu "Pesanan Saya". Kebijakan refund (pengembalian dana) akan bergantung pada kebijakan spesifik yang ditetapkan oleh masing-masing pemilik properti.' },
  { q: 'Bagaimana cara bergabung menjadi Tenant (Pemilik Properti)?', a: 'Klik menu "Menjadi Tenant" di halaman utama atau navigasi, daftarkan akun Anda, lengkapi profil, dan Anda sudah bisa mulai menambahkan properti pertama Anda di dashboard khusus.' },
];

const ContactPage: FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Default open first FAQ

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 border-none px-6 py-4 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all outline-none";

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
            Hubungi Kami.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Ada pertanyaan, masukan, atau kendala? Tim dukungan kami selalu siap mendengarkan dan membantu Anda setiap saat.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4 max-w-7xl mx-auto"></div>

      {/* Contact Information Cards (Editorial Style) */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {contactInfo.map(({ icon: Icon, label, value, desc }, idx) => (
            <div key={idx} className="flex flex-col">
              <Icon size={32} className="text-slate-900 dark:text-white mb-6" />
              <h3 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-2">{label}</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{value}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content: Form & FAQ Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        
        {/* Left Column: Form */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Tinggalkan Pesan</h2>
          
          {submitted && (
            <div className="mb-8 p-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium flex items-center justify-between">
              Pesan Anda berhasil dikirim! Tim kami akan segera merespons.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Nama Lengkap</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Alamat Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com" className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Subjek</label>
              <input
                type="text" required value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Bagaimana kami bisa membantu?" className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Pesan Anda</label>
              <textarea
                rows={6} required value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tuliskan detail pertanyaan atau keluhan Anda di sini..." className={inputClass}
              />
            </div>
            <button type="submit"
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              Kirim Pesan Sekarang <Send size={18} />
            </button>
          </form>
        </div>

        {/* Right Column: FAQs */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-2">
            {faqs.map(({ q, a }, idx) => (
              <div 
                key={idx} 
                className="border-b border-slate-200 dark:border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-lg font-bold text-slate-900 dark:text-white pr-8 group-hover:text-rose-600 transition-colors">
                    {q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {openFaq === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
};

export default ContactPage;
