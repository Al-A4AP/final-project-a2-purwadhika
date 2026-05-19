import type { FC } from 'react';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from 'lucide-react';

// kayaknya halaman kontak gak usah ada kolom isian, nanti kt rbh lagi
const contactInfo = [
  { icon: Mail, label: 'Email', value: 'info@propertyrenting.com', href: 'mailto:info@propertyrenting.com' },
  { icon: Phone, label: 'Telepon', value: '+62 819 0933 3337', href: 'tel:+6281909333337' },
  { icon: MapPin, label: 'Alamat', value: 'Jl. Buah Batu No.55, Bandung, Jawa Barat 40265', href: '#' },
  { icon: Clock, label: 'Jam Layanan', value: 'Senin – Jumat: 08.00 – 20.00 WIB', href: '#' },
];

const faqs = [
  { q: 'Bagaimana cara memesan properti?', a: 'Cari properti di halaman utama, pilih tanggal dan tamu, klik "Pesan", pilih metode pembayaran, dan selesaikan pembayaran.' },
  { q: 'Apakah pembayaran aman?', a: 'Ya! Kami menggunakan Midtrans sebagai payment gateway yang telah tersertifikasi PCI DSS, atau opsi transfer manual dengan konfirmasi admin.' },
  { q: 'Bagaimana jika saya ingin membatalkan pesanan?', a: 'Pembatalan dapat dilakukan melalui halaman "Pesanan Saya". Kebijakan refund bergantung pada kebijakan masing-masing properti.' },
  { q: 'Bagaimana cara mendaftarkan properti saya?', a: 'Daftar sebagai Tenant, verifikasi akun, lalu tambahkan properti Anda melalui dashboard Tenant.' },
];

const ContactPage: FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi pengiriman pesan
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-linear-to-br from-red-600 to-red-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl text-red-100">
            Ada pertanyaan atau masukan? Tim kami siap membantu Anda kapan saja.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="text-red-600" size={24} /> Kirim Pesan
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-400 text-sm font-medium">
              ✅ Pesan Anda telah berhasil dikirim! Kami akan membalas dalam 1×24 jam.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Email</label>
                <input
                  type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@email.com" className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subjek</label>
              <input
                type="text" required value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Pertanyaan tentang pemesanan..." className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pesan</label>
              <textarea
                rows={6} required value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tuliskan pesan Anda di sini..." className={inputClass}
              />
            </div>
            <button type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              <Send size={18} /> Kirim Pesan
            </button>
          </form>
        </div>

        {/* Info & FAQ */}
        <div className="space-y-10">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Informasi Kontak</h2>
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 transition group"
                >
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition">
                    <Icon className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-gray-900 dark:text-white font-medium mt-0.5">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-red-600" size={22} /> Pertanyaan Umum
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group bg-gray-50 dark:bg-slate-800 rounded-xl p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900 dark:text-white text-sm list-none flex justify-between items-center">
                    {q}
                    <span className="ml-2 text-red-600 group-open:rotate-45 transition-transform duration-200 text-xl font-light">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t dark:border-slate-700 pt-3">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
