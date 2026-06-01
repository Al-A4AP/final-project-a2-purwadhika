import type { LegalSectionData } from "./legalTypes";

export const LEGAL_UPDATED_AT = "1 Juni 2026";

export const LEGAL_SECTIONS: LegalSectionData[] = [
  {
    id: "privacy",
    label: "Privacy Policy",
    title: "Privacy Policy",
    summary: "Kebijakan ini menjelaskan data yang dikumpulkan, alasan pemrosesan, dan kontrol yang tersedia untuk pengguna PURWALOKA.",
    points: [
      { title: "Data akun", body: "Kami menyimpan nama, email, nomor telepon, peran akun, dan informasi profil yang pengguna berikan saat registrasi atau pembaruan profil." },
      { title: "Data pemesanan", body: "Kami memproses tanggal menginap, jumlah tamu, properti yang dipilih, bukti pembayaran manual, status transaksi, dan riwayat pesanan." },
      { title: "Penggunaan data", body: "Data digunakan untuk autentikasi, pengelolaan booking, verifikasi pembayaran, komunikasi transaksi, keamanan akun, dan peningkatan layanan." },
      { title: "Penyimpanan pihak ketiga", body: "Aplikasi dapat memakai Supabase PostgreSQL untuk data aplikasi dan Cloudinary untuk penyimpanan gambar seperti properti, kamar, atau bukti pembayaran." },
      { title: "Hak pengguna", body: "Pengguna dapat memperbarui profil, meminta perubahan email, mengganti password, dan menghubungi admin untuk pertanyaan terkait data akun." },
    ],
  },
  {
    id: "terms",
    label: "Terms of Service",
    title: "Terms of Service",
    summary: "Ketentuan ini mengatur penggunaan PURWALOKA oleh pengguna tamu dan tenant yang mengelola properti.",
    points: [
      { title: "Penggunaan akun", body: "Pengguna bertanggung jawab menjaga kredensial akun dan memastikan informasi yang diberikan akurat saat registrasi, booking, atau pengelolaan properti." },
      { title: "Pemesanan dan pembayaran", body: "Pesanan mengikuti ketersediaan kamar, harga aktif, durasi upload bukti pembayaran, dan proses konfirmasi tenant sesuai status transaksi." },
      { title: "Pembatalan", body: "Pembatalan tersedia sesuai status yang diperbolehkan sistem, termasuk pesanan manual transfer yang masih menunggu pembayaran." },
      { title: "Kewajiban tenant", body: "Tenant wajib menjaga data properti, kamar, fasilitas, harga, dan ketersediaan agar tetap benar dan tidak menyesatkan pengguna." },
      { title: "Batasan layanan", body: "PURWALOKA menyediakan platform pengelolaan pemesanan; gangguan teknis, validasi pembayaran, dan perubahan ketersediaan dapat memengaruhi proses transaksi." },
    ],
  },
];
