# Rencana Perbaikan Detail

Tanggal update: 17 Juni 2026  
Acuan: audit final hardening, clean code, REST API guidelines, ownership, security, dan PURWADHIKA.

## Ringkasan

Dokumen ini adalah rencana kerja aktif setelah final hardening phase. Beberapa temuan P0/P1 sebelumnya sudah selesai pada source flow aktif tanpa destructive migration. Fokus berikutnya adalah verifikasi manual, cleanup bertahap, dan hardening lanjutan yang tidak mengubah business logic tanpa konfirmasi.

Status verifikasi terakhir:

| Pemeriksaan | Status |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Backend ownership test | Lulus, 7/7 |
| File source >200 baris | Tidak ditemukan pada `frontend/src` dan `backend/src` |
| Function length audit | 137 kandidat advisory |
| Frontend advisory | 122 kandidat |
| Backend advisory | 15 kandidat |
| `any` / cast residue | Tidak ditemukan pada scan source |
| `console.*` | Tidak ditemukan pada scan source |
| `debugger` | Tidak ditemukan |

## Selesai Pada Hardening Terbaru

### Booking dan Payment

Status: selesai, perlu manual QA concurrency.

- Order dibuat saat user klik `Lanjut ke Pembayaran`, bukan saat klik `Reservasi`.
- Flow terbaru: Property Detail -> Reservasi -> Form Booking -> Tinjauan & Persetujuan -> Lanjut ke Pembayaran -> Order Created (`WAITING_PAYMENT`) -> Inventory Locked.
- `WAITING_PAYMENT` berlaku 1 jam.
- Jika melewati 1 jam, sistem auto cancel dan inventory release.
- Manual payment `WAITING_CONFIRMATION` berlaku maksimal 2 jam.
- Jika tenant tidak konfirmasi dalam 2 jam, sistem auto cancel.
- CTA pembayaran/retry hanya aktif untuk `WAITING_PAYMENT` yang belum expired.
- Voucher transaction timeout sudah diperbaiki dengan scope transaction yang lebih pendek.
- Double booking protection sudah memakai advisory lock, availability recheck, dan atomic voucher update.

### Security dan Session

Status: selesai.

- Persistent token blacklist sudah database-backed.
- Token disimpan dalam bentuk SHA256 hash.
- Aman untuk multi-instance deployment.
- Cleanup dilakukan melalui cron.

### Profile

Status: selesai.

Customer profile:

- User Name
- KTP Number
- KTP Name
- KTP Address
- Phone

Tenant profile:

- User Name
- Phone
- Operational Address

`domicile_address` sudah dihapus dari flow aktif dan tidak ditemukan lagi pada source search terbaru.

### Referral

Status: selesai pada flow aktif.

Referral system tidak lagi digunakan pada:

- Booking
- Voucher
- Dashboard
- Reward

Catatan: jika masih ada legacy schema/data di database, migration destructive hanya boleh dilakukan setelah konfirmasi user.

### Voucher

Status: selesai pada flow aktif.

Voucher yang didukung:

- `PERCENTAGE`
- `FREE_NIGHTS`

Voucher yang dihapus dari flow aktif:

- `NOMINAL`

Free nights ditampilkan sebagai `Gratis X Malam`, bukan `X Rp`.

Aturan pricing `FREE_NIGHTS` saat ini:

- `discountedNights = min(freeNights, stayNights)`.
- Jika nightly breakdown tersedia, diskon diterapkan pada malam termurah terlebih dahulu.
- Jika total pembayaran menjadi Rp0, order langsung `PROCESSED` dan tidak membuat transaksi Midtrans.

### Room Rules

Status: selesai.

- Maksimal 5 jenis kamar per properti.
- Maksimal stock kamar 20.

### Refactor Batch

Status: selesai.

- Refactor Batch 1: email utility awal.
- Refactor Batch 2: `PropertiesListView`.
- Refactor Batch 3: `RoomsListView`.
- Refactor Batch 4: `OrderCard`.
- Refactor backend order: `orderService.ts` turun dari sekitar 377 baris menjadi 184 baris.
- Refactor backend voucher: `voucherService.ts` turun dari 203 baris menjadi 116 baris.
- Refactor email content: `emailContent.ts` dipecah per domain dan file utama menjadi re-export kecil.
- Type-safety cleanup: property detail, room status, cropper adapter.
- Script log cleanup: `backend/src/scripts/backfill.ts`.
- Explore search query consistency: tombol `Cari` dan `Terapkan Filter` memakai helper query Explore yang sama.
- Login attempt guard: 5 gagal login -> lock 15 menit.
- Function advisory reduction batch terbaru: dashboard UI, review UI, saved properties, dan property report presentational parts.

## Tahap Berikutnya

### Tahap 1 - Manual QA Final Hardening

Risiko: sedang  
Prioritas: P0/P1 verification

Checklist:

1. Simulasikan dua user booking kamar/property yang sama secara paralel.
2. Pastikan hanya satu transaksi yang berhasil lock inventory.
3. Pastikan transaksi lain menerima pesan availability tidak cukup.
4. Uji `WAITING_PAYMENT` melewati 1 jam.
5. Uji manual payment `WAITING_CONFIRMATION` melewati 2 jam.
6. Uji voucher percentage dan free nights pada checkout, termasuk kasus malam termurah dan total Rp0.
7. Uji voucher quota habis dan voucher tidak valid.

### Tahap 2 - PII/Data Minimization

Risiko: sedang  
Prioritas: P1

Target:

- Tenant order list
- Tenant report
- Property report
- User order summary

Rencana:

1. Audit response yang mengandung KTP, alamat, dan phone.
2. Ganti Prisma `include` menjadi `select` eksplisit bila memungkinkan.
3. Pisahkan response summary dan detail.
4. Pastikan frontend tidak bergantung pada field sensitif di list.

### Tahap 3 - File >200 Monitoring

Risiko: rendah  
Prioritas: P2

Status audit terbaru:

- Tidak ditemukan file source aktif >200 baris pada `frontend/src` dan `backend/src`.

Selesai pada refactor terbaru:

- `backend/src/services/orderService.ts`: sudah turun menjadi 184 baris.
- `backend/src/services/voucherService.ts`: sudah turun menjadi 116 baris.
- `backend/src/utils/emailContent.ts`: sudah dipecah per domain dan file utama menjadi re-export kecil.
- `backend/src/services/authService.ts`: tidak lagi muncul sebagai file >200 pada audit source aktif terbaru.

Rencana:

1. Jalankan scan file >200 setelah setiap refactor besar.
2. Jika muncul file >200 baru, refactor per file dan per domain.
3. Jangan ubah business logic booking, payment, availability, voucher, atau cron hanya demi menurunkan angka.
4. Jalankan build/test sesuai area yang tersentuh.

### Tahap 4 - Function Length Advisory

Risiko: rendah-sedang  
Prioritas: P2

Status:

- 137 kandidat function/component >15 baris.
- 122 kandidat di `frontend/src`.
- 15 kandidat di `backend/src`.
- Ini alat bantu audit, bukan hard rule otomatis.

Rencana:

1. Review kandidat per domain, bukan sekaligus.
2. Prioritaskan komponen yang bercampur logic dan UI.
3. Hindari refactor mekanis yang membuat code lebih sulit dibaca.
4. Jalankan lint/build setelah setiap batch kecil.

### Tahap 5 - Legacy Schema Migration

Risiko: tinggi  
Prioritas: hanya setelah konfirmasi

Area:

- Referral legacy schema/data jika masih ada.
- Voucher nominal legacy schema/data jika masih ada.

Aturan:

1. Jangan membuat migration tanpa konfirmasi user.
2. Audit data existing sebelum drop enum/kolom/tabel.
3. Siapkan rollback plan.
4. Verifikasi Supabase setelah migration jika disetujui.

### Tahap 6 - REST Legacy Alias Cleanup

Risiko: sedang  
Prioritas: P2

Rencana:

1. Audit frontend masih memakai endpoint legacy atau tidak.
2. Tambah deprecation note sebelum menghapus alias.
3. Hapus alias hanya setelah regression test aman.
4. Jangan ubah public contract mendadak.

### Tahap 7 - Legacy Empty Folder Cleanup

Risiko: rendah  
Prioritas: P2

Temuan:

- `frontend/src/hooks/tenant/occupancy` kosong.
- `frontend/src/pages/tenant/occupancy` kosong.

Catatan:

- Folder kosong aman dihapus.
- Jangan hapus route `/tenant/occupancy` tanpa keputusan UX, karena route masih dipakai sebagai redirect ke `/tenant/property-report`.
- Jangan hapus `frontend/src/components/tenant/occupancy-calendar`, karena komponen masih dipakai pada property report.

## Recommended Execution Order

1. Manual QA concurrency dan payment expiry.
2. PII/data minimization.
3. Function length batch kecil.
4. Legacy empty folder cleanup.
5. Legacy schema migration jika user setuju.
6. REST legacy alias cleanup.

## Guardrail

- Jangan ubah `docs/guidelines/*`.
- Jangan migration tanpa konfirmasi.
- Jangan mengubah ownership, auth, booking, payment, availability, voucher, atau cron logic tanpa root cause jelas.
- Backend tetap source of truth.
- `userId` dan `tenantId` harus selalu dari JWT.
