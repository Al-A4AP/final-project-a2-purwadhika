import { Mail, MapPin, Phone } from "lucide-react";
import type { ContactInfoItem, FaqItemData } from "./contactTypes";

export const CONTACT_INFO: ContactInfoItem[] = [
  { icon: Mail, label: "Email", value: "info@purwaloka.com", desc: "Kami akan merespons dalam 1x24 jam." },
  { icon: Phone, label: "Telepon / WhatsApp", value: "+62 819 0933 3337", desc: "Senin - Jumat, pukul 08:00 - 20:00 WIB." },
  { icon: MapPin, label: "Kantor Pusat", value: "Jl. Buah Batu No.55", desc: "Bandung, Jawa Barat 40265, Indonesia." },
];

export const FAQS: FaqItemData[] = [
  { q: "Bagaimana cara memesan properti di PURWALOKA?", a: "Sangat mudah! Gunakan fitur pencarian di beranda untuk menemukan properti, pilih tanggal yang tersedia di kalender properti, klik pesan, lalu selesaikan pembayaran melalui Midtrans. Konfirmasi otomatis akan dikirim ke email Anda." },
  { q: "Apakah pembayaran saya dijamin aman?", a: "Sangat aman. Kami menggunakan Midtrans sebagai payment gateway tersertifikasi. Dana Anda akan dilindungi dan baru akan diteruskan ke pemilik properti setelah pesanan terkonfirmasi selesai." },
  { q: "Bagaimana prosedur pembatalan pesanan?", a: "Anda dapat mengajukan pembatalan melalui menu \"Pesanan Saya\". Kebijakan refund (pengembalian dana) akan bergantung pada kebijakan spesifik yang ditetapkan oleh masing-masing pemilik properti." },
  { q: "Bagaimana cara bergabung menjadi Tenant (Pemilik Properti)?", a: "Klik menu \"Menjadi Tenant\" di halaman utama atau navigasi, daftarkan akun Anda, lengkapi profil, dan Anda sudah bisa mulai menambahkan properti pertama Anda di dashboard khusus." },
];
