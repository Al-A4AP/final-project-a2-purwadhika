# LAPORAN AUDIT KEPEMILIKAN (OWNERSHIP) - PURWALOKA
**Tanggal Audit:** 03 Juni 2026
**Fokus Audit:** Perlindungan Data antar-Tenant & Middleware Kepemilikan

---

## 1. PENDAHULUAN
Laporan ini mengevaluasi apakah sistem aplikasi web *Property Renting* PURWALOKA sudah membatasi akses entitas secara ketat sehingga seorang Tenant (Pemilik Properti) tidak bisa memanipulasi, membaca, atau menghapus entitas milik Tenant lain.

## 2. HASIL PEMERIKSAAN KESELURUHAN

Secara arsitektural, perlindungan *ownership* di proyek ini **sangat kokoh pada 90% fitur krusial**. Pengamanan dilakukan dengan tiga metode:
1.  **Middleware Kepemilikan Otomatis** (`verifyPropertyOwnership`, `verifyRoomOwnership`, `verifyPeakRateOwnership`) di-routing.
2.  **Validasi Layanan (Service-level Validation)** (misal: pengecekan `property.tenantId !== tenantId` pada pembaruan order/pesanan).
3.  **Filter Kueri (Query-level Filtering)** (misal: laporan yang langsung di-`where` menggunakan token `tenantId`).

### Rincian Per Modul:

| Modul / Entitas | Status Ownership | Metode Proteksi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Properties** | AMAN | `verifyPropertyOwnership` | `GET`, `PATCH`, `DELETE`, dan pengunggahan gambar ke properti spesifik wajib dicek bahwa properti tersebut milik Tenant yang sedang login. |
| **Rooms** | AMAN | `verifyRoomOwnership` | Penambahan kamar ke properti otomatis mewarisi *property check*. Edit, hapus, & upload gambar kamar memvalidasi ID relasi kamar ke properti milik Tenant. |
| **Peak Season Rates** | AMAN | `verifyPeakRateOwnership` | Tenant hanya dapat menambah atau mengubah tarif *peak season* pada kamar yang terverifikasi miliknya. |
| **Room Availability** | AMAN | `verifyRoomOwnership` | Tenant tidak bisa mematikan/menghidupkan tanggal reservasi di kamar milik Tenant kompetitor. |
| **Orders & Transactions** | AMAN | Service-level Validation | `updateTenantOrderStatus` di `tenantOrderStatus.ts` secara eksplisit mencocokkan `order.property.tenantId` dengan token ID Tenant sebelum mengizinkan konfirmasi/penolakan pesanan. |
| **Reviews & Replies** | AMAN | Service-level Validation | Fungsi `replyReview` dan `deleteTenantReview` di `reviewService.ts` memvalidasi relasi ulasan -> properti -> tenant sebelum tindakan dieksekusi. |
| **Reports & Analytics** | AMAN | Query-level Filtering | Kueri Prisma langsung disuntikkan `req.user.id` dari token otentikasi sehingga mustahil mengambil data pendapatan tenant lain. |
| **Property Categories** | **CELAH DITEMUKAN** | **TIDAK ADA** | Kategori berspesifikasi *Global/Shared*, tetapi semua *Tenant* diberi akses CRUD terhadap kategori *non-default*. |

---

## 3. ANALISIS CELAH KEAMANAN (VULNERABILITY) PADA MODUL KATEGORI

Berdasarkan audit mendalam pada *schema.prisma* dan *categoryService.ts*, entitas `PropertyCategory` **tidak memiliki kolom `tenantId`**. Ini berarti Kategori adalah data referensi global (Shared Dictionary).

Namun, pada `backend/src/routes/tenantRoutes.ts` baris 71-74, *endpoint* ini membolehkan setiap pengguna ber-role `TENANT` untuk mengakses fitur CRUD Kategori:
- `POST /api/tenants/me/categories`
- `PATCH /api/tenants/me/categories/:id`
- `DELETE /api/tenants/me/categories/:id`

Pada `backend/src/services/categoryService.ts`, fungsi `updateCategory` dan `deleteCategory` hanya memvalidasi apakah kategori tersebut adalah kategori "sistem default" (tidak boleh diubah/dihapus) dan apakah sedang digunakan oleh properti aktif.

### Dampak (Impact)
1.  **Vandalisme (Sabotase):** Tenant A bisa merubah nama kategori "Villa Mewah" buatan Tenant B menjadi nama yang buruk, dan perubahan ini akan langsung muncul di halaman properti publik milik Tenant B karena kategori bersifat global.
2.  **Resource Deletion:** Meskipun ada validasi tidak bisa dihapus jika sedang "digunakan", Tenant A dapat menahan (menghapus kategori yang baru saja dibuat oleh Tenant B) sebelum Tenant B sempat mengaitkannya ke properti.

---

## 4. KESIMPULAN & REKOMENDASI

Secara keseluruhan, untuk alur utama bisnis seperti transaksi, uang, harga, properti, dan kamar, **aplikasi ini sangat aman dan tangguh dari intervensi silang antar-Tenant**.

**Rekomendasi untuk Celah Kategori:**
Jika proyek ini adalah proyek untuk presentasi akhir dan tidak ada _Role Admin_ di aplikasi, maka disarankan untuk **mengubah arsitektur kategori menjadi terikat pada entitas properti (tag) atau menambahkan `tenantId` ke dalam tabel `PropertyCategory`**. 
Jika tidak ingin merubah arsitektur Database (mengingat status proyek sudah _Siap Presentasi_), sebaiknya Anda menonaktifkan rute `PATCH` dan `DELETE` untuk fitur Kategori (sehingga Tenant hanya bisa menambah kategori baru untuk dipakai bersama, namun tidak boleh menghapus atau merubahnya).
