import type { FC } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const Footer: FC = () => {
  const { isTenant, isAuthenticated } = useAuthStore();
  const isRegularUser = isAuthenticated && !isTenant;

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg mb-4"><span className="text-rose-500 font-black">PURWA</span><span className="text-white font-black">LOKA</span></h3>
            <p className="text-sm leading-relaxed">
              Platform terpercaya untuk menemukan akomodasi terbaik di Indonesia dengan harga yang kompetitif dan transparan.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Beranda</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Tentang Kami</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Kontak</Link></li>
            </ul>
          </div>

          {/* Tenant */}
          {!isRegularUser && (
            <div>
              <h4 className="text-white font-semibold mb-4">Untuk Pemilik</h4>
              <ul className="space-y-2 text-sm">
                {isTenant ? (
                  <>
                    <li><Link to="/tenant/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                    <li><Link to="/tenant/properties" className="hover:text-white transition">Kelola Properti</Link></li>
                    <li><Link to="/tenant/reports" className="hover:text-white transition">Laporan Penjualan</Link></li>
                    <li><Link to="/tenant/orders" className="hover:text-white transition">Pesanan Tamu</Link></li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/auth/register" className="hover:text-white transition text-rose-500 font-medium">
                        Daftar Menjadi Tenant
                      </Link>
                    </li>
                    <li><p className="text-slate-400 mt-2">Sewakan properti Anda dan raih penghasilan tambahan bersama kami.</p></li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@purwaloka.com" className="hover:text-white transition">
                  info@purwaloka.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+6281909333337" className="hover:text-white transition">
                  +62 819 0933 3337
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>Bandung, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-800 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2026 PURWALOKA. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// saat ini ckp segini dulu, kalo mau tambahin kita diskusi dulu
export default Footer;
