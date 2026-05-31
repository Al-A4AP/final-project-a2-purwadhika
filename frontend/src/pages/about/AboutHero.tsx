import type { FC } from "react";
import { BrandName } from "./BrandName";

export const AboutHero: FC = () => (
  <section className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
    <div className="max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
        <BrandName /> is Indonesia's leading destination for authentic stays.
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
        Misi kami adalah menangkap dan menyajikan kreativitas, kenyamanan, serta momen yang berarti dalam perjalanan Anda. PURWALOKA memberdayakan setiap orang untuk menjadi tuan rumah (*host*) langsung dari ponsel mereka, dan berkomitmen membangun komunitas yang saling percaya.
      </p>
    </div>
  </section>
);
