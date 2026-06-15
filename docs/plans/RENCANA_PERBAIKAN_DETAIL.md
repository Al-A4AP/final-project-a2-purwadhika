# Rencana Perbaikan Detail

Tanggal update: 15 Juni 2026  
Acuan: audit terbaru, clean code, REST API guidelines, ownership, security, dan PURWADHIKA.

## Ringkasan

Rencana lama yang menyatakan seluruh prioritas produksi selesai sudah tidak akurat. Audit 15 Juni 2026 menemukan P0/P1 aktif pada transaction order, double booking, bug profile password, `domicile_address`, migration legacy referral/voucher nominal, dan clean code regression.

Update limited scope 15 Juni 2026:

- Referral sudah dilepas dari UI, payload, dan service flow aktif tanpa destructive migration.
- Voucher nominal sudah dilepas dari UI/validation/service aktif tanpa destructive migration.
- Free Stay voucher sudah diformat `Gratis X Malam`.
- Rule maksimal 5 jenis kamar per properti sudah diterapkan di backend dan frontend.
- Frontend lint sudah kembali lulus.
- Tidak ada destructive migration yang dijalankan.

Rencana ini memisahkan tahap yang sudah selesai dari tahap yang masih perlu dikerjakan. Bagian yang belum selesai tetap menjadi urutan eksekusi aman untuk agent berikutnya.

## Tahap 0 - Guardrail Sebelum Edit

Risiko: rendah  
Prioritas: wajib sebelum implementasi

Checklist:

1. Baca `docs/guidelines/PURWADHIKA.md`.
2. Baca `docs/guidelines/REST_API_GUIDELINES.md`.
3. Baca audit terbaru di `docs/audits/*`.
4. Jalankan baseline read-only:
   - `npm run audit:functions`
   - `cd frontend && npm run lint`
   - `cd frontend && npm run build`
   - `cd backend && npm run build`
   - `cd backend && npm run test:ownership`
5. Jangan migration tanpa konfirmasi user.

## Tahap 1 - Profile Change Password Loading Bug

Risiko: rendah  
Prioritas: P1 cepat

Masalah:

Form change password kosong bisa membuat loading tidak berhenti. Kode masih memakai `zodResolver(passwordSchema)`, sedangkan project sudah memiliki histori bug Zod 4 + `@hookform/resolvers@3.10.0`.

File terdampak:

- `frontend/src/components/user/profile/PasswordChangeForm.tsx`
- `frontend/src/validations/profile.ts`
- Opsional shared helper: `frontend/src/lib/formResolver.ts`

Rencana:

1. Buat resolver custom berbasis `safeParseAsync`, mirip `registerFormResolver`.
2. Ganti `zodResolver(passwordSchema)` pada password form.
3. Tambah invalid-submit handling agar user mendapat toast/pesan field.
4. Pastikan form tidak `reset()` jika API gagal.
5. Verifikasi kosong, password lama salah, konfirmasi tidak cocok, dan sukses.

## Tahap 2 - Transaction Timeout Saat Voucher Dipakai

Risiko: tinggi  
Prioritas: P0

Masalah:

`createOrder` menjalankan terlalu banyak query dalam `prisma.$transaction`, sehingga saat voucher digunakan transaction bisa melewati timeout 5000ms.

File terdampak:

- `backend/src/services/orderService.ts`
- `backend/src/services/voucherService.ts`
- `backend/src/services/pricingService.ts`
- `backend/src/services/availabilityService.ts`

Rencana:

1. Pecah `orderService.ts` terlebih dahulu karena sudah >200 baris.
2. Pisahkan preflight read-only dari final atomic write.
3. Pindahkan `syncUserProfileFromBooking` keluar transaction jika tidak wajib atomic dengan order.
4. Pastikan source flow referral tetap tidak masuk lagi ke create order.
5. Buat voucher quota update atomic:
   - update hanya jika `used_count < quota` atau quota null;
   - validasi assignment tetap scoped by user.
6. Pastikan Midtrans Snap dan email tetap di luar transaction.
7. Tambah test/QA untuk voucher valid, voucher quota habis, voucher assigned, dan Midtrans.

## Tahap 3 - Anti Double Booking Paralel

Risiko: tinggi  
Prioritas: P0

Masalah:

Availability check berbasis read/count belum cukup untuk request paralel.

File terdampak:

- `backend/src/services/orderService.ts`
- `backend/src/services/availabilityService.ts`
- `backend/src/services/availability/availabilityQueries.ts`
- `backend/src/services/availability/availabilityRules.ts`
- Test baru untuk concurrency order

Rencana:

1. Pilih strategi locking:
   - tanpa migration: Postgres advisory lock per room/property + date;
   - dengan migration: inventory/booking lock table per night.
2. Minta konfirmasi user jika butuh migration.
3. Final availability check tetap di dalam transaction.
4. Simulasi 2-5 request paralel untuk stok 1.

## Tahap 4 - Referral Legacy Migration

Risiko: tinggi jika langsung migration  
Prioritas: P1

Business decision: referral dihapus dari project.

Status limited scope: selesai pada source flow aktif tanpa migration.

File terdampak:

- `backend/prisma/schema.prisma`
- Migration baru jika user mengizinkan drop kolom/tabel legacy

Selesai:

1. UI referral dan payload referral frontend sudah dihapus.
2. Validation `referral_code` pada create order sudah dihapus.
3. Call reward referral pada create order, Midtrans processed, dan tenant approval sudah dihapus.
4. Voucher summary sudah voucher-only.
5. File service referral reward dan komponen/hook referral frontend sudah dihapus.

Belum dilakukan:

1. Migration untuk drop:
   - `users.referral_code`
   - `orders.referral_code`
   - table `referral_rewards`
   - relation/index terkait
2. Migration hanya setelah konfirmasi user.

## Tahap 5 - Voucher Simplification

Risiko: sedang-tinggi jika enum DB langsung diubah  
Prioritas: P1

Business decision:

- Dipertahankan: `PERCENTAGE`, `FREE_NIGHTS`.
- Dihapus: `NOMINAL`.

Status limited scope: selesai pada source flow aktif tanpa migration.

File terdampak:

- `backend/prisma/schema.prisma`
- `backend/src/validations/voucherValidation.ts`
- `backend/src/services/voucherService.ts`
- `backend/src/controllers/voucherController.ts`
- `frontend/src/types/voucher.ts`
- `frontend/src/pages/tenant/vouchers/TenantVoucherForm.tsx`
- `frontend/src/pages/tenant/vouchers/TenantVoucherList.tsx`
- `frontend/src/pages/user/dashboard/DashboardVouchers.tsx`
- `frontend/src/pages/user/booking/VoucherCodeBox.tsx`
- `frontend/src/components/user/booking-summary/BookingDiscountRow.tsx`

Selesai:

1. Buat shared formatter `formatVoucherBenefit`.
2. Perbaiki Free Stay display menjadi `Gratis X Malam`.
3. Hapus opsi `NOMINAL` dari frontend form.
4. Backend validation hanya menerima `PERCENTAGE` dan `FREE_NIGHTS`.
5. Service aktif menolak voucher nominal legacy dengan error jelas.

Belum dilakukan:

1. Tangani data existing `NOMINAL` sebelum enum migration:
   - soft-delete voucher nominal; atau
   - convert manual ke percentage/free nights jika ada keputusan.
2. Migration enum hanya setelah data existing aman dan user konfirmasi.

## Tahap 6 - Remove `domicile_address`

Risiko: sedang karena migration destructive  
Prioritas: P1

Business decision: `domicile_address` tidak digunakan lagi.

File terdampak:

- `backend/prisma/schema.prisma`
- `backend/src/validations/orderValidation.ts`
- `backend/src/services/orderService.ts`
- `frontend/src/types/auth.ts`
- `frontend/src/types/order.ts`
- `frontend/src/services/orderService.ts`

Rencana:

1. Hapus dari frontend types dan payload.
2. Hapus dari backend DTO/validation/create data.
3. Pastikan UI profile dan booking tidak memakai field ini.
4. Migration drop kolom:
   - `users.domicile_address`
   - `orders.guest_domicile_address`
5. Migration hanya setelah konfirmasi user karena data lama hilang.

## Tahap 7 - Room Type Maksimal 5

Risiko: rendah-sedang  
Prioritas: P1

Business rule: satu properti maksimal 5 jenis kamar.

Status: selesai.

File terdampak:

- `backend/src/services/tenantRoomService.ts`
- `backend/src/services/tenantRoom/roomQueries.ts`
- `backend/src/validations/propertyValidation.ts`
- `frontend/src/hooks/rooms/useRoomSubmit.ts`
- `frontend/src/pages/tenant/RoomsPage.tsx`
- `frontend/src/components/tenant/room-form/RoomFormFields.tsx`

Selesai:

1. Tambah query count active rooms by property.
2. Di backend `createRoom`, tolak jika count >= 5.
3. Di frontend, disable/tampilkan pesan jika rooms sudah 5.
4. QA lanjutan browser: create room ke-6 harus gagal dengan pesan jelas.

## Tahap 8 - Clean Code Regression

Risiko: rendah-sedang  
Prioritas: P1

Temuan:

- `backend/src/utils/emailService.ts`: 290 baris.
- `npm run audit:functions`: 155 kandidat.
- Frontend lint lulus.
- Ada residue `as any`, `as unknown`, dan `console.*`.

Rencana:

1. Pecah `emailService.ts` ke template/helper email per domain.
2. Pastikan `orderService.ts` tidak kembali melewati 200 baris saat transaction fix.
3. Pastikan `voucherService.ts` tidak kembali melewati 200 baris saat migration legacy voucher.
4. Ganti `as any` dengan type Prisma/domain.
5. Ganti `console.*` pada source utama dengan logger atau hapus jika script lama.

## Tahap 9 - Documentation Update Setelah Implementasi

Risiko: rendah  
Prioritas: dilakukan setelah code fix

File dokumen:

- `README.md`
- `docs/README.md`
- `docs/HANDOVER.local.md`
- `docs/plans/RENCANA_PERBAIKAN_DETAIL.md`
- `docs/audits/AUDIT_PURWADHIKA_FINAL.md`
- `docs/audits/AUDIT_OWNERSHIP_SECURITY.md`
- `docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`

Rencana:

1. Setelah setiap tahap selesai, update status dari `belum` menjadi `selesai`.
2. Jangan klaim lint/build lulus sebelum command aktual lulus.
3. Jangan klaim file <200 sebelum scan aktual lulus.
4. Update function-length count berdasarkan `npm run audit:functions`.

## Recommended Execution Order

1. Profile password resolver.
2. Transaction timeout create order + voucher.
3. Anti double booking paralel.
4. Clean code residue.
5. Migration referral/voucher/domicile jika user sudah konfirmasi.
6. Final lint/build/ownership/browser QA.
7. Update dokumentasi final.
