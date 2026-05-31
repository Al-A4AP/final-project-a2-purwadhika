import type { FC } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { FooterGrid } from './footer/FooterGrid';
import { FooterLegal } from './footer/FooterLegal';

const Footer: FC = () => {
  const { isTenant, isAuthenticated } = useAuthStore();
  const isRegularUser = isAuthenticated && !isTenant;
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FooterGrid isRegularUser={isRegularUser} isTenant={isTenant} />
        <hr className="border-slate-800 my-8" />
        <FooterLegal />
      </div>
    </footer>
  );
};

export default Footer;
