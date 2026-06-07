# Project Documentation

Folder ini menyimpan dokumentasi pendukung final project agar root project tetap ringkas dan mudah diperiksa.

Tanggal audit dokumentasi terbaru: 07 Juni 2026.

## Struktur

- `audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`: audit clean code, function-length advisory, lint/build, dan kepatuhan REST API.
- `audits/AUDIT_OWNERSHIP_SECURITY.md`: audit ownership, authorization, browser storage, dan keamanan.
- `audits/AUDIT_PURWADHIKA_FINAL.md`: audit keseluruhan berdasarkan requirement PURWADHIKA.
- `plans/RENCANA_PERBAIKAN_DETAIL.md`: sisa rencana yang belum dilaksanakan atau masih opsional.
- `plans/RENCANA_PERBAIKAN_UAT_BROWSER_2026_06_07.md`: rencana aktif berdasarkan temuan UAT browser 07 Juni 2026.
- `guidelines/PURWADHIKA.md`: requirement final project.
- `guidelines/REST_API_GUIDELINES.md`: panduan REST resource naming.
- `guidelines/CODE_LINE_CHECK_GUIDELINES.md`: panduan pengecekan batas baris.

## Kebijakan README

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` di folder dokumentasi ini.

README di folder `frontend` dan `backend` sudah dihapus oleh user dan tidak dibuat ulang. Detail frontend/backend dirangkum di README root dan audit docs.

## Ringkasan Audit Terbaru

| Area | Status |
| --- | --- |
| Frontend Architecture & UI/UX | Tersentralisasi di `hooks/`, UI *view-only* untuk Tenant, UX konsisten |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Ownership test | Lulus, 7/7 |
| File source >200 baris | Tidak ditemukan pada `backend/src`, `backend/tests`, `frontend/src` |
| `any`, `debugger`, `console.*` | Tidak ditemukan pada source utama |
| Function length audit | 87 kandidat manual review; advisory only |
| REST API | Jalur utama sesuai resource-oriented; legacy alias masih dicatat |
| Ownership | Baik dan teruji |
| Browser storage | Tidak ada JWT auth token di localStorage |
| UAT browser lanjutan | Ada rencana aktif sebelum klaim final ditutup |

## Catatan Clean Code

- Batas file 200 baris terpenuhi pada source utama.
- `backend/prisma/schema.prisma` berisi 261 baris dan dicatat sebagai pengecualian teknis deklaratif.
- `tools/audit-function-length.js` adalah alat bantu audit, bukan hard rule build.
- Output function-length harus dinilai manual agar refactor tidak berlebihan.

## Catatan REST API

Jalur utama sudah mengikuti resource-oriented API, misalnya:

- `/api/users/me/orders`
- `/api/tenants/me/orders`
- `/api/tenants/me/properties`
- `/api/orders/:id/payments`
- `/api/orders/:id/status-transitions`
- `/api/reviews/:reviewId/replies`
- `/api/locations/geocodes`

Legacy alias masih aktif untuk backward compatibility dan dicatat di plan cleanup.

## Catatan Ownership dan Security

- Tenant resource dilindungi `requireAuth`, `requireRole(['TENANT'])`, dan ownership middleware.
- Ownership regression test berada di `backend/tests/ownership/ownership.test.ts`.
- Auth token memakai HTTP-only cookie backend.
- LocalStorage hanya dipakai untuk tema, saved properties lokal, dan cleanup legacy storage.
- SessionStorage dipakai untuk auth notice sementara.

## Rencana Aktif UAT Browser

Temuan browser terbaru pada 07 Juni 2026 dicatat sebagai rencana aktif di:

- `plans/RENCANA_PERBAIKAN_UAT_BROWSER_2026_06_07.md`

Area utama:

- dashboard tenant harus membatasi data historis sampai tanggal saat ini;
- kategori tenant perlu deskripsi dan mode sewa default;
- properti tenant perlu membedakan `PER_ROOM` dan `WHOLE_PROPERTY`;
- voucher tenant perlu penyederhanaan UI dan validasi bisnis;
- booking perlu validasi step Data Tamu sebelum lanjut;
- tenant order rejection perlu alasan wajib dan tampil ke user;
- profile perlu tombol kembali ke dashboard sesuai role.

## Cara Verifikasi Cepat

```bash
npm run audit:functions
cd frontend
npm run lint
npm run build
cd ../backend
npm run build
npm run test:ownership
```
