# Project Documentation

Folder ini menyimpan dokumentasi pendukung final project agar root project tetap ringkas dan mudah diperiksa.

Tanggal audit dokumentasi terbaru: 15 Juni 2026.

## Struktur

- `audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`: audit clean code, function-length advisory, lint/build, dan kepatuhan REST API.
- `audits/AUDIT_OWNERSHIP_SECURITY.md`: audit ownership, authorization, browser storage, PII, dan keamanan.
- `audits/AUDIT_PURWADHIKA_FINAL.md`: audit keseluruhan berdasarkan requirement PURWADHIKA.
- `audits/AUDIT_ZOD_RESOLVER_BUG.md`: histori bug Zod resolver pada React Hook Form.
- `plans/RENCANA_PERBAIKAN_DETAIL.md`: rencana perbaikan aktif berdasarkan audit terbaru.
- `guidelines/PURWADHIKA.md`: requirement final project.
- `guidelines/REST_API_GUIDELINES.md`: panduan REST resource naming.
- `guidelines/CODE_LINE_CHECK_GUIDELINES.md`: panduan pengecekan batas baris.
- `guidelines/TOOLS_GUIDELINE.md`: panduan penggunaan tool audit advisory.

## Kebijakan README

README hanya dipertahankan di:

- `README.md` pada root project.
- `docs/README.md` di folder dokumentasi ini.

README di folder `frontend` dan `backend` tidak dibuat ulang.

## Ringkasan Audit Terbaru

| Area | Status aktual |
| --- | --- |
| Frontend lint | Lulus |
| Frontend build | Lulus |
| Backend build | Lulus |
| Ownership test | Lulus, 7/7 |
| File source >200 baris | 1 file: `backend/src/utils/emailService.ts` |
| Function length audit | 155 kandidat manual review; advisory only |
| `any`, `debugger`, `console.*` | Masih ada `as any`, `as unknown`, dan `console.*` residue |
| REST API | Jalur utama resource-oriented; legacy alias masih dicatat |
| Ownership | Baik pada test utama; PII response perlu data minimization |
| Transaction | Create order + voucher perlu refactor transaction scope |
| Referral | Source flow non-migration selesai; destructive migration belum dilakukan |
| Voucher nominal | Source flow non-migration selesai; destructive migration belum dilakukan |
| `domicile_address` | Diputuskan tidak digunakan lagi, belum dihapus dari schema/type |
| Room max 5 type | Selesai di backend dan frontend |

## Catatan Clean Code

- `npm run audit:functions` adalah alat bantu audit, bukan hard rule build.
- Banyak kandidat frontend berupa JSX presentasional panjang; refactor tetap perlu penilaian manual.
- Saat ini masih ada 1 file source utama >200 baris.
- Dokumentasi lama yang menyebut 103 kandidat atau lint/build sepenuhnya lulus sudah tidak lagi akurat.

## Catatan REST API

Jalur utama sudah resource-oriented, tetapi legacy alias masih aktif:

- `GET /api/orders/user`
- `GET /api/orders/tenant`
- `POST /api/orders/:id/payment-attempts`
- `PATCH /api/orders/:id/status`
- `POST /api/reviews/:reviewId/reply`
- `POST /api/tenants/me/rooms/:roomId/availability/range`
- `PATCH /api/tenants/me/rooms/:roomId/images/:imageId/main`

Cleanup legacy alias dilakukan setelah regression test.

## Catatan Ownership dan Security

- Auth token memakai HTTP-only cookie, bukan localStorage.
- Ownership regression test lulus 7/7.
- Tenant route utama memakai `requireAuth`, `requireRole`, dan ownership middleware.
- PII/KTP pada list order tenant/report perlu ditinjau ulang agar response hanya mengirim field yang dibutuhkan UI.
- Referral removal dan voucher simplification sudah selesai pada source flow aktif tanpa destructive migration.
- Schema/data legacy referral dan voucher nominal hanya boleh dihapus lewat migration setelah konfirmasi user.

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

Status terakhir:

- `frontend npm run lint`: lulus.
- `frontend npm run build`: lulus.
- `backend npm run build`: lulus.
- `backend npm run test:ownership`: lulus.
