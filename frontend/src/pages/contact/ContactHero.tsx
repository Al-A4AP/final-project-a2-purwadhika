import type { FC } from "react";

export const ContactHero: FC = () => (
  <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
    <div className="max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
        Hubungi Kami.
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
        Ada pertanyaan, masukan, atau kendala? Tim dukungan kami selalu siap mendengarkan dan membantu Anda setiap saat.
      </p>
    </div>
  </section>
);
