import type { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandName } from "./BrandName";

export const MissionText: FC = () => (
  <div>
    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"><BrandName /> for Good</h2>
    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">Kami memicu dialog yang bermakna, memberdayakan ekonomi lokal, dan mengubah aset properti menjadi dampak nyata di dunia nyata di seluruh komunitas global kami.</p>
    <Link to="/" className="inline-flex items-center text-rose-600 font-bold hover:text-rose-700 transition-colors text-lg group">
      Temukan lebih lanjut <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
    </Link>
  </div>
);
