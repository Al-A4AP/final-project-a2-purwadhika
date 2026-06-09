# Audit Report: Zod Resolver Validation Lifecycle Bug

## Deskripsi Masalah
Pada tanggal 09 Juni 2026, ditemukan sebuah bug kritis pada form registrasi aplikasi PURWALOKA. Ketika pengguna memasukkan data yang tidak valid (misalnya `"a   "` pada kolom Nama Lengkap), form akan masuk ke state `isSubmitting: true` ("Mendaftarkan...") dan macet selamanya. Tidak ada pesan error validasi yang muncul, dan tidak ada request API yang dikirim. 

## Root Cause Analysis
Melalui penelusuran lifecycle React Hook Form (RHF), terbukti bahwa masalah **bukan** berasal dari UI form atau request API, melainkan karena *Unhandled Promise Rejection* yang dilempar (throw) dari dalam library `@hookform/resolvers/zod` (versi 3.10.0).
Hal ini terjadi karena skema Zod (versi 4.x) menghasilkan objek `ZodError` tanpa properti `.errors`. Resolver lama mencoba memvalidasinya menggunakan `Array.isArray(error?.errors)`, dan karena gagal, resolver membuang (throw) error tersebut ke RHF, memutus eksekusi form secara paksa tanpa reset status `isSubmitting`.

## Alternatif Solusi & Uji Kegagalan

Selama proses audit, beberapa alternatif sempat dieksplorasi dengan hasil kegagalan yang terdokumentasikan:

### 1. Modifikasi Skema dengan `.transform()`
*   **Tujuan:** Membersihkan whitespace sebelum divalidasi.
*   **Hasil:** Gagal. Resolver *crash* melempar unhandled exception karena format error dimodifikasi oleh `transform`.
*   **Error Console:**
    `Uncaught (in promise) ZodError: [{ "code": "custom", "message": "Nama minimal 3 karakter" }]`

### 2. Modifikasi Skema dengan `.superRefine()`
*   **Tujuan:** Menginjeksi error secara manual via `ctx.addIssue()` tanpa menggunakan modifikator `.transform()`.
*   **Hasil:** Gagal. Pembuktian eksekusi via skrip isolasi (`test-super-refine.ts`) menunjukkan bahwa Zod 4.x tetap tidak menghasilkan struktur error `.errors` yang diharapkan oleh resolver 3.10.0. Resolver tetap *crash*.

### 3. Upgrade Dependency (`npm install @hookform/resolvers@latest`)
*   **Tujuan:** Memperbarui fungsi internal resolver agar mengenali format Zod 4.
*   **Hasil:** Gagal Parsial / Menghasilkan Bug Mematikan Baru. Meskipun versi terbaru memperbaiki Zod, instalasi lokal ini merusak lingkungan *NPM Workspaces (Monorepo)*. NPM menarik dependensi `react` ganda ke dalam `frontend/node_modules`.
*   **Error Browser (White Screen):**
    `Invalid hook call. Hooks can only be called inside of the body of a function component.`
    `TypeError: Cannot read properties of null (reading 'useRef')`
*   **Tindakan Penyelamatan:** Dilakukan `git reset --hard origin/main`, pembersihan paksa folder `node_modules` dari OS, dan `npm install` murni dari *root* untuk merestorasi *single React instance*.

## Solusi Akhir (Implementasi Sukses)
Untuk menghindari resiko konflik dependency React dan tetap mempertahankan prinsip *Clean Code*, diimplementasikan **Pure Custom Resolver** pada `frontend/src/hooks/auth/register/registerFormResolver.ts`. 

Pendekatan ini:
1. Membuang `zodResolver` seutuhnya.
2. Mengeksekusi validasi secara asli dengan `registerSchema.safeParseAsync()`.
3. Memetakan *Zod Issues* secara damai menjadi tipe `FieldErrors` standar yang dibaca oleh RHF.

Bug berhasil ditutup 100%. Validasi frontend beroperasi sempurna, input invalid segera ditolak, pesan merah dirender, dan status `isSubmitting` dijamin bebas dari macet tanpa menyentuh arsitektur *library* eksternal.
