import { BarChart2, Building2, LayoutDashboard, MessageSquare, ShoppingBag, Tags } from 'lucide-react';

export const TENANT_NAV = [
  { to: '/tenant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tenant/properties', icon: Building2, label: 'Properti Saya' },
  { to: '/tenant/categories', icon: Tags, label: 'Kategori' },
  { to: '/tenant/orders', icon: ShoppingBag, label: 'Pesanan' },
  { to: '/tenant/reviews', icon: MessageSquare, label: 'Ulasan Tamu' },
  { to: '/tenant/reports', icon: BarChart2, label: 'Laporan' },
];
