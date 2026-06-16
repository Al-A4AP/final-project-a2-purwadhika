# Rencana Perbaikan Detail

Tanggal update: 16 Juni 2026  
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
| File source >200 baris | 3 file backend |
| Function length audit | 145 kandidat advisory |
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
- Type-safety cleanup: property detail, room status, cropper adapter.
- Script log cleanup: `backend/src/scripts/backfill.ts`.

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
6. Uji voucher percentage dan free nights pada checkout.
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

### Tahap 3 - File >200 Cleanup

Risiko: sedang  
Prioritas: P1

Sisa temuan file >200:

- `backend/src/services/orderService.ts`: 219 baris
- `backend/src/services/voucherService.ts`: 216 baris
- `backend/src/utils/emailContent.ts`: 207 baris

Rencana:

1. Refactor per file, jangan sekaligus.
2. Pecah helper murni dan formatter terlebih dahulu.
3. Jangan ubah business logic booking, voucher, payment, atau email output.
4. Jalankan backend build dan ownership test setelah batch backend.

### Tahap 4 - Function Length Advisory

Risiko: rendah-sedang  
Prioritas: P2

Status:

- 145 kandidat function/component >15 baris.
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

## Recommended Execution Order

1. Manual QA concurrency dan payment expiry.
2. PII/data minimization.
3. File >200 cleanup backend.
4. Function length batch kecil.
5. Legacy schema migration jika user setuju.
6. REST legacy alias cleanup.

## Guardrail

- Jangan ubah `docs/guidelines/*`.
- Jangan migration tanpa konfirmasi.
- Jangan mengubah ownership, auth, booking, payment, availability, voucher, atau cron logic tanpa root cause jelas.
- Backend tetap source of truth.
- `userId` dan `tenantId` harus selalu dari JWT.
