import { BarChart2, Building2, CalendarDays, Home, LayoutDashboard, MessageSquare, ShoppingBag, Tags, CalendarClock, CreditCard, LineChart } from 'lucide-react';

export const TENANT_NAV = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/tenant/dashboard', icon: LayoutDashboard, label: 'Host Dashboard' },
  { to: '/tenant/categories', icon: Tags, label: 'Kategori' },
  { to: '/tenant/properties', icon: Building2, label: 'Properti Saya' },
  { to: '/tenant/occupancy', icon: CalendarDays, label: 'Ketersediaan Kamar' },
  { to: '/tenant/peak-season', icon: CalendarClock, label: 'Harga Musiman' },
  { to: '/tenant/orders', icon: ShoppingBag, label: 'Reservasi' },
  { to: '/tenant/payment-confirmation', icon: CreditCard, label: 'Konfirmasi Pembayaran' },
  { to: '/tenant/reports', icon: BarChart2, label: 'Laporan Penjualan' },
  { to: '/tenant/property-report', icon: LineChart, label: 'Laporan Properti' },
  { to: '/tenant/reviews', icon: MessageSquare, label: 'Ulasan Tamu' },
];
