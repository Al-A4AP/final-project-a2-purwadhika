# Project Documentation

Folder ini menyimpan dokumen pendukung final project agar root project tetap rapi.

## Struktur

- `audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md`: audit clean code dan kepatuhan REST API.
- `audits/AUDIT_OWNERSHIP_SECURITY.md`: audit ownership, authorization, browser storage, dan keamanan.
- `audits/AUDIT_PURWADHIKA_FINAL.md`: audit keseluruhan berdasarkan `PURWADHIKA.md`.
- `plans/RENCANA_PERBAIKAN_DETAIL.md`: sisa rencana yang belum dilaksanakan atau masih opsional.

## Catatan Clean Code

- File TypeScript/JavaScript di `backend/src`, `backend/tests`, dan `frontend/src` dijaga di bawah 200 baris.
- Function utama dijaga pendek dan dipisah ke helper/hook/component kecil jika mulai terlalu panjang.
- Scan terakhir tidak menemukan `console.*`, `debugger`, atau `any` pada source utama.
- Audit function length otomatis tersedia melalui `npm run audit:functions`; script ini advisory dan tidak menggagalkan build.
- `backend/prisma/schema.prisma` berisi lebih dari 200 baris karena Prisma schema bersifat deklaratif dan lazim terpusat dalam satu file.

## Catatan Browser Storage

- Auth token disimpan sebagai HTTP-only cookie dari backend, bukan di `localStorage`.
- `localStorage` frontend hanya dipakai untuk preferensi UI seperti tema, filter ringan, dan saved properties lokal.
- `sessionStorage` dipakai untuk notice sementara setelah redirect auth.

## Catatan REST API

- Endpoint baru mengikuti pola resource-oriented seperti `/api/users/me/orders`, `/api/tenants/me/orders`, dan `/api/orders/:id/payments`.
- Beberapa endpoint lama masih dipertahankan sebagai backward compatibility dan perlu diputuskan saat final cleanup apakah akan tetap didokumentasikan atau dihapus bertahap.
