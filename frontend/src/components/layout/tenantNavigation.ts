import { BarChart2, Building2, Home, LayoutDashboard, MessageSquare, ShoppingBag, Tags, CalendarClock, LineChart, TicketPercent } from 'lucide-react';

export const TENANT_NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/tenant/dashboard', icon: LayoutDashboard, label: 'Tenant Dashboard' },
  { to: '/tenant/categories', icon: Tags, label: 'Kategori' },
  { to: '/tenant/properties', icon: Building2, label: 'Properti Saya' },
  { to: '/tenant/peak-season', icon: CalendarClock, label: 'Harga Musiman' },
  { to: '/tenant/vouchers', icon: TicketPercent, label: 'Voucher' },
  { to: '/tenant/orders', icon: ShoppingBag, label: 'Reservasi' },
  { to: '/tenant/reports', icon: BarChart2, label: 'Laporan Penjualan' },
  { to: '/tenant/property-report', icon: LineChart, label: 'Laporan & Ketersediaan' },
  { to: '/tenant/reviews', icon: MessageSquare, label: 'Ulasan Tamu' },
];
