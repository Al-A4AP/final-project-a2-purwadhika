# Rencana Perbaikan Sisa Setelah Audit Final

Tanggal update: 11 Juni 2026  
Acuan: audit clean code, REST API guidelines, ownership, security, PURWADHIKA, dan Vercel Serverless Architecture

## Ringkasan

Rencana besar sebelumnya sudah dilaksanakan: clean code residual, validasi query, endpoint REST baru utama, security hardening dasar, ownership regression test, browser storage cleanup, struktur dokumentasi, cron scheduler, UI/UX tenant/user bertahap, dan function-length audit advisory.

File ini menyimpan rencana aktif dan sisa rekomendasi yang belum dilaksanakan atau masih perlu keputusan final. Item yang sudah selesai tidak dicatat lagi sebagai rencana kerja aktif.


## Sudah Dilaksanakan

| Item | Status |
| --- | --- |
| File source utama <200 baris | Selesai |
| Hapus `any`, `debugger`, dan `console.*` dari source utama | Sebagian (sisa `tenantPropertyFilters.ts` dan `webhookRoutes.ts`) |
| Validasi query backend | Selesai |
| Endpoint resource-oriented utama | Selesai |
| Update frontend ke endpoint utama | Selesai |
| Security headers dan rate limiter dasar | Selesai |
| HTTP-only auth cookie | Selesai |
| LocationIQ backend proxy | Selesai |
| Ownership regression test | Selesai |
| Browser storage cleanup | Selesai |
| Struktur `docs/audits`, `docs/plans`, `docs/guidelines` | Selesai |
| README hanya di root dan `docs` | Selesai secara dokumentasi |
| Vercel Serverless Proxy (atasi Cross-Origin Cookie & CSRF) | Selesai |
| Webhook Cron Jobs (ganti `node-cron` persisten) | Selesai |
| Function-length audit otomatis advisory | Selesai (103 kandidat terpantau) |
| Explore desktop sidebar filter dan mobile auto-close filter | Selesai |
| Tenant reports/reviews/property performance pagination | Selesai |
| Whole Property double booking backend guard | Selesai |
| Whole Property property detail calendar sync | Selesai |
| Whole Property CTA disabled state | Selesai |

## Sisa Rencana Opsional yang Belum Dilaksanakan

### 1. Cleanup Legacy REST Alias

Risiko: Menengah  
Prioritas: Opsional sebelum final jika penilaian REST ingin sangat ketat

Masalah:

Jalur endpoint baru sudah ada, tetapi beberapa alias lama masih aktif untuk backward compatibility.

Endpoint terdampak:

- `GET /api/orders/user`
- `GET /api/orders/tenant`
- `POST /api/orders/:id/payment-attempts`
- `PATCH /api/orders/:id/status`
- `POST /api/reviews/:reviewId/reply`
- `POST /api/tenants/me/rooms/:roomId/availability/range`
- `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main`

File terdampak:

- `backend/src/routes/orderRoutes.ts`
- `backend/src/routes/reviewRoutes.ts`
- `backend/src/routes/tenantRoutes.ts`
- `frontend/src/services/orderService.ts`
- `frontend/src/services/reviewService.ts`
- `frontend/src/services/availabilityService.ts`
- `frontend/src/services/tenantService.ts`
- Dokumentasi API bila dibuat terpisah

Tahapan aman:

1. Pastikan seluruh frontend sudah memakai endpoint baru.
2. Jalankan browser regression untuk booking, payment retry, cancel manual order, tenant status update, reply review, room availability, dan room image main.
3. Beri deprecation note sementara jika belum ingin menghapus langsung.
4. Hapus alias lama satu kelompok per tahap.
5. Jalankan `frontend npm.cmd run lint`, `frontend npm.cmd run build`, `backend npm.cmd run build`, dan `backend npm.cmd run test:ownership`.

### 2. Review Kandidat Function-Length Advisory

Risiko: Rendah-menengah  
Prioritas: Opsional clean code jika mentor menilai aturan 15 baris sangat ketat

Masalah:

Script `npm run audit:functions` menemukan 103 kandidat manual review. Mayoritas kandidat frontend adalah JSX presentasional panjang, sehingga perlu review manual sebelum dipecah.

Prioritas kandidat awal:

- `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx`
- `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx`
- `frontend/src/pages/tenant/property-form/PropertyImageField.tsx`
- `frontend/src/hooks/tenant/room-form/useRoomImageField.ts`
- `frontend/src/components/user/OrderCard.tsx`
- `backend/src/services/categoryService.ts`
- `backend/src/services/tenantPropertyService.ts`

Catatan update 07 Juni 2026:

- `RoomImageField.tsx` sudah dipisah menjadi hook `useRoomImageField`, `RoomImageDropzone`, dan `RoomGalleryGrid`.
- `ReservationStepper.tsx` sudah dipisah menjadi indikator step, konten step, upload bukti transfer, dan action footer.
- `components/ui` sudah ditambahkan sebagai fondasi UI primitive kecil.
- Action/type auth dan tenant orders sudah dipindahkan keluar dari `pages` agar hooks tidak bergantung pada page files.

Tahapan aman:

1. Jalankan `npm run audit:functions`.
2. Prioritaskan kandidat yang mencampur logic dan JSX.
3. Hindari memecah component presentasional jika hasilnya lebih sulit dibaca.
4. Refactor satu area per tahap.
5. Jalankan lint/build sesuai area terdampak.


### 3. Persistent Token Blacklist

Risiko: Menengah  
Prioritas: Production hardening jika backend multi-instance

Masalah:

Token blacklist saat logout masih in-memory. Ini cukup untuk single process, tetapi tidak ideal untuk deployment multi-instance.

File yang kemungkinan terdampak:

- `backend/src/services/tokenBlacklistService.ts`
- `backend/src/config/prisma.ts`
- `backend/prisma/schema.prisma` jika memakai database
- Alternatif config Redis jika memakai Redis

Tahapan aman:

1. Tentukan storage: Redis lebih cocok untuk expiry token, database lebih mudah tanpa infra tambahan.
2. Jika database, buat model blacklist token dan migration.
3. Update service blacklist untuk read/write persistent storage.
4. Tambahkan test logout dan revoked token.

### 4. Saved Properties Menjadi Data Akun

Risiko: Menengah-tinggi  
Prioritas: Product improvement, bukan blocker requirement

Masalah:

Saved properties saat ini disimpan di localStorage. Ini aman untuk preferensi lokal, tetapi tidak tersinkron antar device.

File yang kemungkinan terdampak:

- `frontend/src/hooks/useSavedProperties.ts`
- `frontend/src/hooks/savedPropertiesStorage.ts`
- `frontend/src/pages/user/SavedPropertiesPage.tsx`
- `backend/src/routes/userRoutes.ts`
- `backend/src/controllers/userController.ts`
- `backend/src/services/userService.ts`
- `backend/prisma/schema.prisma`

Tahapan aman:

1. Putuskan apakah saved properties wajib menjadi fitur akun.
2. Jika wajib, tambahkan schema/model database.
3. Buat endpoint user saved properties.
4. Migrasikan frontend dari localStorage ke API dengan fallback local cache.
5. Uji login/logout, saved/unsaved, refresh page, dan multi-device.

### 5. Prioritas Tindakan Lanjutan (Audit 09 Juni 2026)

Berdasarkan audit otomatis terbaru, seluruh perbaikan prioritas produksi (P0 & P1) telah selesai dan diverifikasi. Sisa tindakan merupakan pengembangan lanjutan dan perapian:

**Prioritas P2 (Refactor & Enhancement):**
1. Refactor manual 103 kandidat function >15 baris.
2. Jadikan kategori Explore dinamis.
3. Lakukan Browser QA final.

## Rekomendasi Urutan

1. Selesaikan P0 (Query Validation `all_time`, Clean Code residue, Serverless `app.listen`).
2. Selesaikan P1 (Env docs, UX Booking, Voucher Validation).
3. Cleanup legacy REST alias jika ingin standar REST paling ketat.
4. Pindahkan token blacklist ke storage persistent jika backend multi-instance.
5. Pertimbangkan saved properties backend hanya jika fitur akun lintas device dibutuhkan.

## Status Verifikasi Terakhir

- Frontend lint: lulus.
- Frontend build: lulus.
- Backend build: lulus.
- Ownership test: lulus, 7/7.
- Function-length audit advisory: 103 kandidat manual review.
- Scan clean code utama: tidak ada file source utama >200 baris, minor residue `any` & `console.error` dicatat di `RENCANA_PERBAIKAN_DETAIL`.
