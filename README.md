# PropRent - Final Project Property Renting Web App

Platform aplikasi web *Property Renting* (Penyewaan Properti) yang dibangun untuk menghubungkan Pemilik Properti (*Tenant*) dan Penyewa (*User*). Menawarkan sistem pemesanan kamar lengkap dengan integrasi analitik, kalender harga dinamis (*peak rates*), dan verifikasi *email* otomatis.

## Tim Pengembang (Group 1)
* **Anggita Zahra Kamila** (Fitur 2)
* **Muhammad Ali Akbar** (Fitur 1)

---

## Fitur Utama

### Untuk Penyewa (*User*)
* **Pencarian Pintar**: Filter berdasarkan kota, tanggal, rentang harga, dan fasilitas. Didukung deteksi lokasi otomatis via *LocationIQ*.
* **Manajemen Pemesanan**: Kalender pemesanan terintegrasi dengan ketersediaan properti secara *real-time*.
* **Autentikasi Aman**: Login dan Pendaftaran tradisional beserta integrasi *Google OAuth*.
* **Ulasan Properti**: Memberikan ulasan pasca-*checkout* dan memengaruhi *rating* sistem.

### Untuk Pemilik Properti (*Tenant*)
* **Dasbor & Analitik Lanjut**: Visualisasi performa penjualan (*Recharts*) serta *Gantt Chart* untuk kalender okupansi.
* **Manajemen Properti & Kamar**: Mendukung pengaturan *Peak Season Rates* dan harga dasar.
* **Sistem Laporan Otomatis**: Integrasi *Payment Gateway* dan penyesuaian pesanan otomatis via sistem *cron job*.

---

## Teknologi & Stack

* **Frontend**: React.js 18, Vite, TypeScript, Tailwind CSS, Zustand (Persist State), React Hook Form, Recharts, React Router Dom (Code Splitting via React.Lazy).
* **Backend**: Node.js, Express.js, Prisma ORM, PostgreSQL.
* **Infrastruktur / Layanan**: Midtrans (Payment Gateway), Cloudinary (Image Hosting), Nodemailer (Email Notification), Google OAuth, LocationIQ.

---

## Panduan Instalasi (Setup Instructions)

### Prasyarat
* Node.js v18+
* PostgreSQL v14+ ter-install lokal atau gunakan layanan Cloud SQL (Supabase/Neon).

### 1. Kloning Repositori
Lakukan *clone* terhadap repositori ini:
```bash
git clone <url-repo-anda>
cd final-pro-a2
```

### 2. Setup Lingkungan Backend
Buka terminal baru untuk setup server *backend*:
```bash
cd backend
npm install
```
Buat file `.env` di folder `backend/` dan isi dengan kredensial sesuai yang diberikan (*Database URL, Cloudinary, Email SMTP, Midtrans, dll*).

Jalankan migrasi Prisma untuk membangun struktur database:
```bash
npx prisma migrate dev
```
Bila diperlukan, jalankan *seed* untuk mendapatkan *dummy data* awal:
```bash
npx prisma db seed
```
Jalankan server *backend*:
```bash
npm run dev
```

### 3. Setup Lingkungan Frontend
Buka terminal baru untuk setup klien *frontend*:
```bash
cd frontend
npm install
```
Buat file `.env` di folder `frontend/` dan isi dengan URL API dan kredensial eksternal (*Vite Google OAuth Client ID, LocationIQ API Key, dll*).

Jalankan *frontend*:
```bash
npm run dev
```

---

## Aturan Kontribusi (Git Workflow)

Lakukan semua modifikasi via *branch* terpisah atau ikuti panduan berikut bila bekerja langsung pada repositori:
1. Simpan perubahan ke riwayat Git: `git add .` dan `git commit -m "Deskripsi perubahan"`
2. Perbarui perubahan dari sumber utama sebelum me-*push*: `git pull origin main`
3. Terapkan pembaruan lokal jika ada migrasi database dari teman tim Anda (`npx prisma migrate dev` / `npm install`).
4. *Push* ke repositori: `git push origin main`

**Catatan Khusus**: Selalu buat *backup folder* sebelum *pull* besar. Untuk `npx prisma db seed` harap dikonfirmasi terlebih dahulu agar data tidak tertimpa berulang kali.
