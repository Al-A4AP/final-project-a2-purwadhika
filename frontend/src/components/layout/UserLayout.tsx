import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

const UserLayout: FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default UserLayout;
