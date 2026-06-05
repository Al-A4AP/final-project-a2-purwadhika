# Rencana Perbaikan Sisa Setelah Audit Final

Tanggal update: 05 Juni 2026  
Acuan: audit final clean code, REST API, ownership, security, dan PURWADHIKA

## Ringkasan

Rencana besar sebelumnya sudah banyak dilaksanakan: clean code residual, validasi query, endpoint REST baru, security hardening dasar, ownership regression test, browser storage cleanup, struktur dokumentasi, dan pemindahan cron scheduler.

File ini hanya menyimpan sisa rekomendasi yang belum dilaksanakan atau masih perlu keputusan final. Item yang sudah selesai tidak lagi dicantumkan sebagai rencana kerja aktif.

## Sudah Dilaksanakan

| Item | Status |
| --- | --- |
| Clean code residual | Selesai |
| Hapus `console.*`, `debugger`, dan `any` pada source utama | Selesai |
| File sumber <200 baris | Selesai |
| Validasi query backend | Selesai |
| Endpoint baru resource-oriented | Selesai |
| Update frontend ke endpoint baru utama | Selesai |
| Security headers dasar | Selesai |
| HTTP-only auth cookie | Selesai |
| LocationIQ backend proxy | Selesai |
| Ownership regression test | Selesai |
| Browser storage cleanup | Selesai |
| Struktur `docs/audits` dan `docs/plans` | Selesai |
| Cron scheduler dipindah ke folder `backend/src/cron/` | Selesai |
| Function length audit otomatis advisory | Selesai |

## Sisa Rencana yang Belum Dilaksanakan

### 1. Cleanup Legacy REST Alias

Risiko: Menengah  
Prioritas: Opsional sebelum final, penting jika penilaian REST ingin sangat ketat

Masalah:

Jalur endpoint baru sudah ada, tetapi beberapa alias lama masih aktif untuk backward compatibility.

Endpoint terdampak:

- `GET /api/orders/user`
- `GET /api/orders/tenant`
- `POST /api/orders/:id/cancellations`
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
- README/API documentation

Tahapan aman:

1. Pastikan seluruh frontend sudah memakai endpoint baru.
2. Jalankan browser regression untuk booking, payment retry, cancel manual order, tenant status update, reply review, room availability, dan room image main.
3. Beri komentar/deprecation note sementara jika belum ingin menghapus.
4. Hapus alias lama satu kelompok per commit/per tahap.
5. Jalankan `frontend npm.cmd run lint`, `frontend npm.cmd run build`, `backend npm.cmd run build`, dan `backend npm.cmd run test:ownership`.

### 2. CSRF Token untuk Cookie Auth Production

Risiko: Menengah  
Prioritas: Production hardening

Masalah:

Auth token sudah HTTP-only cookie dengan `sameSite: strict`, tetapi jika deployment production memakai cookie-auth cross-origin atau domain yang lebih kompleks, CSRF token eksplisit akan lebih kuat.

File yang kemungkinan terdampak:

- `backend/src/middlewares/`
- `backend/server.ts`
- `backend/src/config/authCookie.ts`
- `frontend/src/services/api.ts`

Tahapan aman:

1. Tentukan apakah production benar-benar membutuhkan CSRF token.
2. Tambahkan endpoint/token bootstrap atau double-submit cookie.
3. Tambahkan interceptor frontend untuk mengirim CSRF header.
4. Terapkan middleware hanya pada state-changing request.
5. Uji login, logout, profile update, booking, payment proof, tenant CRUD, dan review.

### 3. Persistent Token Blacklist

Risiko: Menengah  
Prioritas: Production hardening jika backend multi-instance

Masalah:

Token blacklist saat logout masih in-memory. Ini cukup untuk single process, tetapi tidak ideal untuk deployment multi-instance.

File yang kemungkinan terdampak:

- `backend/src/services/tokenBlacklistService.ts`
- `backend/src/config/prisma.ts`
- `backend/prisma/schema.prisma` jika memakai database
- Alternatif: config Redis jika memakai Redis

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
5. Uji login/logout, saved/unsaved, dan refresh page.

### 5. Review Kandidat Function Length Audit

Risiko: Rendah-menengah  
Prioritas: Opsional clean code jika penilaian 15 baris sangat ketat

Masalah:

Script `npm run audit:functions` sudah tersedia dan berjalan sebagai alat bantu non-blocking. Hasil terakhir menemukan 90 kandidat di atas 15 baris: 88 di `frontend/src` dan 2 di `backend/src`. Mayoritas adalah komponen JSX presentasional panjang yang perlu dinilai manual sebelum dipecah.

File yang kemungkinan terdampak:

- `frontend/src/components/tenant/room-form/RoomImageField.tsx`
- `frontend/src/pages/user/booking/ReservationStepper.tsx`
- `frontend/src/pages/tenant/rooms-page/RoomsListView.tsx`
- `frontend/src/pages/user/HomePage.tsx`
- `frontend/src/pages/tenant/PeakSeasonPage.tsx`
- `frontend/src/pages/tenant/properties-list/PropertiesListView.tsx`
- `backend/src/services/categoryService.ts`
- `backend/src/services/tenantPropertyService.ts`

Tahapan aman:

1. Jalankan `npm run audit:functions`.
2. Prioritaskan kandidat yang berisi logic bercampur dengan JSX, bukan markup presentasional murni.
3. Pecah hanya jika helper/component baru membuat kode lebih jelas.
4. Hindari memecah component kecil secara berlebihan hanya demi angka 15 baris.
5. Setelah refactor kandidat tertentu, jalankan lint/build sesuai area terdampak.

## Rekomendasi Urutan

1. Cleanup legacy REST alias jika ingin standar REST paling ketat.
2. Tambahkan CSRF token jika deployment production membutuhkan.
3. Pindahkan token blacklist ke storage persistent jika backend multi-instance.
4. Pertimbangkan saved properties backend hanya jika fitur akun lintas device dibutuhkan.
5. Review kandidat function length audit jika mentor meminta kepatuhan 15 baris yang lebih ketat.

## Status Verifikasi Terakhir

- Frontend lint: lulus.
- Frontend build: lulus.
- Backend build: lulus.
- Ownership test: lulus, 7/7.
- Function length audit advisory: tersedia melalui `npm run audit:functions`; hasil terakhir 90 kandidat manual review.
- Scan clean code utama: tidak ada `console.*`, `debugger`, `any`, dan tidak ada file sumber >200 baris.
