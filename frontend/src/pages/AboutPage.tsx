import type { FC } from 'react';
import { Shield, Star, MapPin, Users, Award, Heart } from 'lucide-react';

// standar dulu ya
const stats = [
  { value: '500+', label: 'Properti Terdaftar' },
  { value: '10.000+', label: 'Tamu Puas' },
  { value: '50+', label: 'Kota di Indonesia' },
  { value: '98%', label: 'Tingkat Kepuasan' },
];

const values = [
  { icon: Shield, title: 'Aman & Terpercaya', desc: 'Setiap properti diverifikasi secara manual oleh tim kami sebelum dipublikasikan.' },
  { icon: Star, title: 'Kualitas Premium', desc: 'Kami hanya bekerja sama dengan pemilik properti yang berkomitmen pada kualitas dan kebersihan.' },
  { icon: MapPin, title: 'Jangkauan Luas', desc: 'Ribuan pilihan properti dari Sabang sampai Merauke, siap memenuhi kebutuhan Anda.' },
  { icon: Users, title: 'Komunitas Kuat', desc: 'Bergabunglah dengan jutaan pengguna dan pemilik properti yang saling mendukung.' },
  { icon: Award, title: 'Penghargaan', desc: 'Meraih penghargaan sebagai platform properti terbaik 2024 dari Kementerian Pariwisata.' },
  { icon: Heart, title: 'Pelayanan Tulus', desc: 'Kami hadir 24/7 untuk memastikan pengalaman menginap Anda selalu menyenangkan.' },
];

const team = [
  { name: 'Budi Santoso', role: 'CEO & Co-Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
  { name: 'Siti Rahayu', role: 'CTO & Co-Founder', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
  { name: 'Andi Pratama', role: 'Head of Operations', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
  { name: 'Dewi Lestari', role: 'Head of Marketing', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
];

const AboutPage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero */}
      <section className="bg-linear-to-br from-red-600 to-red-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Tentang Kami</h1>
          <p className="text-xl md:text-2xl text-red-100 leading-relaxed">
            Platform terpercaya untuk menemukan akomodasi terbaik di seluruh Indonesia.
            Kami menghubungkan jutaan penyewa dengan ribuan pemilik properti berkualitas.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-red-600 mb-2">{s.value}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Cerita Kami</h2>
          <div className="space-y-6 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            <p>
              <strong className="text-gray-900 dark:text-white">Property Renting</strong> lahir dari sebuah mimpi sederhana:
              memudahkan siapa saja untuk menemukan tempat menginap yang nyaman, aman, dan terjangkau di mana pun di Indonesia.
            </p>
            <p>
              Didirikan pada tahun 2022 oleh sekelompok anak muda yang pernah merasakan sulitnya mencari akomodasi yang tepat
              saat bepergian, kami berkomitmen untuk menciptakan solusi yang tidak hanya membantu para penyewa, tetapi juga
              memberdayakan para pemilik properti untuk mendapatkan penghasilan tambahan dari aset mereka.
            </p>
            <p>
              Dalam waktu kurang dari tiga tahun, kami telah berkembang menjadi salah satu platform properti terkemuka di
              Indonesia dengan lebih dari 500 properti aktif dan puluhan ribu pengguna setia di seluruh nusantara.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Tim Kami</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-transparent group-hover:ring-red-400 transition-all duration-300">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-red-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
