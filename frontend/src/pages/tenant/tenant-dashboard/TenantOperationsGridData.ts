import { Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TENANT_NAV } from "@/components/layout/tenantNavigation";

export interface TenantOperationItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bg: string;
}

const getTenantNavIcon = (path: string, fallback: LucideIcon = Building2) =>
  TENANT_NAV.find((item) => item.to === path)?.icon || fallback;

export const operations: TenantOperationItem[] = [
  operation("Kategori", "Kelola tipe properti", "/tenant/categories", "text-rose-500", "bg-rose-50 dark:bg-rose-500/10"),
  operation("Properti", "Daftar properti Anda", "/tenant/properties", "text-blue-500", "bg-blue-50 dark:bg-blue-500/10"),
  operation("Kamar", "Kelola tipe kamar", "/tenant/properties", "text-indigo-500", "bg-indigo-50 dark:bg-indigo-500/10"),
  operation("Ketersediaan", "Atur ketersediaan", "/tenant/occupancy", "text-emerald-500", "bg-emerald-50 dark:bg-emerald-500/10"),
  operation("Peak Season", "Atur harga khusus", "/tenant/peak-season", "text-amber-500", "bg-amber-50 dark:bg-amber-500/10"),
  operation("Voucher", "Kelola promo", "/tenant/vouchers", "text-fuchsia-500", "bg-fuchsia-50 dark:bg-fuchsia-500/10"),
  operation("Reservasi", "Semua pesanan", "/tenant/orders", "text-cyan-500", "bg-cyan-50 dark:bg-cyan-500/10"),
  operation("Lap. Penjualan", "Performa pendapatan", "/tenant/reports", "text-green-500", "bg-green-50 dark:bg-green-500/10"),
  operation("Lap. Properti", "Statistik properti", "/tenant/property-report", "text-orange-500", "bg-orange-50 dark:bg-orange-500/10"),
  operation("Ulasan", "Feedback tamu", "/tenant/reviews", "text-yellow-500", "bg-yellow-50 dark:bg-yellow-500/10"),
];

function operation(
  title: string,
  desc: string,
  href: string,
  color: string,
  bg: string,
): TenantOperationItem {
  return { title, desc, href, icon: getTenantNavIcon(href), color, bg };
}
