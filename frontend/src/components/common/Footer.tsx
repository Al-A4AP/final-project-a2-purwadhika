import type { FC } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">🏡 Property Renting</h3>
            <p className="text-sm leading-relaxed">
              Platform terpercaya untuk menemukan akomodasi terbaik di Indonesia dengan harga yang kompetitif dan transparan.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Beranda</a></li>
              <li><a href="#" className="hover:text-white transition">Properti</a></li>
              <li><a href="#" className="hover:text-white transition">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white transition">Kontak</a></li>
            </ul>
          </div>

          {/* Tenant */}
          <div>
            <h4 className="text-white font-semibold mb-4">Untuk Pemilik</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Daftar Properti</a></li>
              <li><a href="#" className="hover:text-white transition">Kelola Properti</a></li>
              <li><a href="#" className="hover:text-white transition">Laporan Penjualan</a></li>
              <li><a href="#" className="hover:text-white transition">Pusat Bantuan</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@propertyrenting.com" className="hover:text-white transition">
                  info@propertyrenting.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+6281234567890" className="hover:text-white transition">
                  +62 812-3456-7890
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 Property Renting. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
