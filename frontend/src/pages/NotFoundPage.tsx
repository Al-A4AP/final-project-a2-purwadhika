import type { FC } from 'react';
import { Link } from 'react-router-dom';

const notFoundImageUrl = 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&h=500&fit=crop';

const NotFoundPage: FC = () => (
  <div className="min-h-screen bg-[#FDFDFB] dark:bg-slate-950 flex items-center justify-center p-6 font-sans">
    <NotFoundContent />
  </div>
);

const NotFoundContent = () => (
  <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-20">
    <NotFoundImage />
    <NotFoundCopy />
  </div>
);

const NotFoundImage = () => (
  <div className="w-full md:w-1/2 flex justify-center md:justify-end">
    <img src={notFoundImageUrl} alt="Kalo tulisan ini muncul berarti link gambar juga 404 ya" className="w-64 md:w-112.5 h-64 md:h-112.5 object-cover rounded-3xl drop-shadow-xl" />
  </div>
);

const NotFoundCopy = () => (
  <div className="w-full md:w-1/2 text-center md:text-left">
    <NotFoundTitle />
    <NotFoundMessage />
    <HomeLink />
  </div>
);

const NotFoundTitle = () => (
  <h1 className="text-6xl md:text-8xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tighter">
    404 <span className="text-slate-400 font-light">-</span> <br className="hidden md:block" /> Page <br className="hidden md:block" /> Not Found
  </h1>
);

const NotFoundMessage = () => (
  <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
    Halaman ini lebih susah dicari daripada bug random jam 2 pagi..
  </p>
);

const HomeLink = () => (
  <Link to="/" className="inline-block bg-[#4FBDBA] hover:bg-[#3FA8A6] text-white font-bold py-4 px-8 rounded shadow-lg transition-colors duration-300">
    Kembali ke Beranda
  </Link>
);

export default NotFoundPage;
