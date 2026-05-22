import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import ThemeToggle from './ThemeToggle';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setProfileOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl tracking-widest">
            <span className="text-rose-600 font-bold">PURWA</span><span className="text-slate-900 dark:text-white font-bold">LOKA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition">Beranda</Link>
            <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition">Tentang Kami</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition">Kontak</Link>
            
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
            
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in origin-top-right">
                    <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" onClick={() => setProfileOpen(false)}>
                        <User size={16} className="text-slate-400" /> Profil Saya
                      </Link>
                      {user?.role === 'USER' && (
                        <Link to="/orders" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" onClick={() => setProfileOpen(false)}>
                          <ShoppingBag size={16} className="text-slate-400" /> Pesanan Saya
                        </Link>
                      )}
                      {user?.role === 'TENANT' && (
                        <Link to="/tenant/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition" onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={16} className="text-slate-400" /> Dashboard Tenant
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-slate-50 dark:border-slate-800 pt-2 pb-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/auth/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition">
                  Masuk
                </Link>
                <Link to="/auth/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition shadow-sm">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
            {isAuthenticated && (
              <div className="px-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
            )}

            <div className="px-2 space-y-1">
              <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Beranda</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Tentang Kami</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Kontak</Link>
            </div>

            {isAuthenticated ? (
              <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <User size={18} className="text-slate-400" /> Profil Saya
                </Link>
                {user?.role === 'USER' && (
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <ShoppingBag size={18} className="text-slate-400" /> Pesanan Saya
                  </Link>
                )}
                {user?.role === 'TENANT' && (
                  <Link to="/tenant/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <LayoutDashboard size={18} className="text-slate-400" /> Dashboard Tenant
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="px-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                <Link to="/auth/login" onClick={() => setIsOpen(false)} className="text-center py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Masuk
                </Link>
                <Link to="/auth/register" onClick={() => setIsOpen(false)} className="text-center py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-sm">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;