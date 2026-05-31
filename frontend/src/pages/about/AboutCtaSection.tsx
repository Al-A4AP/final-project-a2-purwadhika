import type { FC } from "react";
import { Link } from "react-router-dom";

export const AboutCtaSection: FC = () => (
  <section className="bg-slate-900 text-white py-24 px-6 text-center mt-12">
    <h2 className="text-4xl md:text-5xl font-bold mb-8">Siap Memulai Perjalanan Anda?</h2>
    <div className="flex justify-center gap-4">
      <Link to="/" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors">Cari Properti</Link>
      <Link to="/auth/register/tenant" className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">Menjadi Tenant</Link>
    </div>
  </section>
);
