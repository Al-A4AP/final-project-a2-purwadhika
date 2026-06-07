import type { FC } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TENANT_NAV } from "@/components/layout/tenantNavigation";

const operations = [
  { title: "Kategori", desc: "Kelola tipe properti", icon: getTenantNavIcon("/tenant/categories"), href: "/tenant/categories", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  { title: "Properti", desc: "Daftar properti Anda", icon: getTenantNavIcon("/tenant/properties"), href: "/tenant/properties", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { title: "Kamar", desc: "Kelola tipe kamar", icon: getTenantNavIcon("/tenant/properties"), href: "/tenant/properties", color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { title: "Ketersediaan", desc: "Atur ketersediaan", icon: getTenantNavIcon("/tenant/occupancy"), href: "/tenant/occupancy", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { title: "Peak Season", desc: "Atur harga khusus", icon: getTenantNavIcon("/tenant/peak-season"), href: "/tenant/peak-season", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { title: "Voucher", desc: "Kelola promo", icon: getTenantNavIcon("/tenant/vouchers"), href: "/tenant/vouchers", color: "text-fuchsia-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10" },
  { title: "Reservasi", desc: "Semua pesanan", icon: getTenantNavIcon("/tenant/orders"), href: "/tenant/orders", color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
  { title: "Lap. Penjualan", desc: "Performa pendapatan", icon: getTenantNavIcon("/tenant/reports"), href: "/tenant/reports", color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { title: "Lap. Properti", desc: "Statistik properti", icon: getTenantNavIcon("/tenant/property-report"), href: "/tenant/property-report", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { title: "Ulasan", desc: "Feedback tamu", icon: getTenantNavIcon("/tenant/reviews"), href: "/tenant/reviews", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
];

function getTenantNavIcon(path: string, fallback: LucideIcon = Building2) {
  return TENANT_NAV.find((item) => item.to === path)?.icon || fallback;
}

export const TenantOperationsGrid: FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pintasan Operasional</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {operations.map((op, i) => (
          <Link 
            key={i} 
            to={op.href}
            className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${op.bg} ${op.color} transition-transform group-hover:scale-110`}>
              <op.icon size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{op.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{op.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
