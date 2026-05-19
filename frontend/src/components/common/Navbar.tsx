import type { FC } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-600">
            🏡 Property Renting
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition">Beranda</Link>
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition">Tentang Kami</Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-red-600 transition">Kontak</Link>
            <div className="w-px h-5 bg-gray-300 dark:bg-slate-600 mx-1" />
            {isAuthenticated ? (
              <>
                {user?.role === 'USER' && (
                  <Link to="/orders" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                    Pesanan Saya
                  </Link>
                )}
                {user?.role === 'TENANT' && (
                  <Link to="/tenant/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                    Dashboard Tenant
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-red-600">
                  Masuk
                </Link>
                <Link to="/auth/register" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                  Daftar
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 dark:text-gray-300">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Beranda</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Tentang Kami</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Kontak</Link>
            <hr className="border-gray-200 dark:border-slate-700 mx-4" />
            {isAuthenticated ? (
              <>
                {user?.role === 'USER' && (
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                    Pesanan Saya
                  </Link>
                )}
                {user?.role === 'TENANT' && (
                  <Link to="/tenant/dashboard" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                    Dashboard Tenant
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Profil
                </Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Masuk
                </Link>
                <Link to="/auth/register" className="block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// ide navbar baru ini, next ada ide kita set lg