import { Lock, ShieldCheck, Users } from "lucide-react";
import type { CommunityStory, ImpactStat, TrustFeature } from "./aboutTypes";

export const IMPACT_STATS: ImpactStat[] = [
  { value: "Rp 50M+", label: "Kontribusi pada Ekonomi Lokal" },
  { value: "15.000+", label: "Pemilik Properti Terbantu" },
  { value: "2 Juta+", label: "Pemesanan Berhasil" },
];

export const COMMUNITY_STORIES: CommunityStory[] = [
  { name: "Ibu Kusuma", location: "Ubud, Bali", quote: "\"Berkat PURWALOKA, kamar kosong di rumah kami kini menjadi sumber pendapatan utama untuk membiayai pendidikan anak-anak kami.\"", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
  { name: "Dimas Pratama", location: "Yogyakarta", quote: "\"Platform ini memungkinkan saya memulai bisnis penginapan kecil-kecilan tanpa modal pemasaran yang besar. Sangat mudah digunakan.\"", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
  { name: "Keluarga Siregar", location: "Bandung", quote: "\"Setiap akhir pekan kami selalu mengandalkan PURWALOKA untuk mencari villa liburan yang ramah keluarga dan terverifikasi aman.\"", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=400&fit=crop" },
];

export const TRUST_FEATURES: TrustFeature[] = [
  { icon: ShieldCheck, title: "Properti Terverifikasi", description: "Tim kami melakukan kurasi dan verifikasi pada setiap properti untuk memastikan apa yang Anda lihat adalah apa yang akan Anda dapatkan." },
  { icon: Lock, title: "Privasi & Keamanan Data", description: "Kami menjunjung tinggi prinsip privasi saat kami terus membangun secara bertanggung jawab, adil, dan terbuka." },
  { icon: Users, title: "Transaksi Terlindungi", description: "Integrasi pembayaran kami (Midtrans) memastikan dana Anda aman hingga masa menginap Anda terkonfirmasi selesai." },
];
