# Panduan Penggunaan Tools Audit

Folder `tools/` pada *root* project ini berisi skrip bantu (berbasis Node.js) yang dirancang untuk mengotomatiskan tugas-tugas *review* kode yang bersifat *advisory* (saran).

## 1. Audit Panjang Fungsi (Function Length Audit)

Skrip `tools/audit-function-length.js` bertujuan memindai *codebase* `frontend/src` dan `backend/src` untuk mencari deklarasi fungsi (baik *Arrow Function* maupun *Function Declaration*) yang berpotensi melanggar pedoman panjang fungsi maksimal 15 baris.

### Sifat Tool (Advisory Only)
**Penting:** Skrip ini adalah alat bantu (*advisory tool*), bukan pemblokir *build* (*hard rule*). Sangat wajar jika komponen React (JSX yang bersifat deklaratif) melampaui 15 baris karena strukturnya. Anda tidak diwajibkan untuk memaksakan refaktor (*breakdown*) jika itu malah membuat kode menjadi kurang kohesif atau lebih sulit dibaca.

### Cara Menjalankan

Melalui npm script:
```bash
npm run audit:functions
```

Atau secara langsung menggunakan Node:
```bash
node tools/audit-function-length.js
```

### Membaca Hasil Output

Skrip akan menampilkan tabel detail di terminal dengan format:
- **Location:** Lokasi file beserta nomor baris (*line number*) tempat fungsi dideklarasikan.
- **Name:** Nama fungsi (misal: `DashboardPage`, `handleLogin`, dsb).
- **Type:** Tipe fungsi (`ArrowFunction` atau `FunctionDeclaration`).
- **Lines:** Jumlah baris murni dari blok logika (tidak termasuk baris kosong dan komentar).

### Tindakan Pasca-Audit

Setelah Anda mendapatkan daftar *kandidat manual review*:
1. **Analisa Komponen React:** Jika fungsi panjang didominasi oleh elemen presentasional (JSX tag panjang, properti *Tailwind* tebal), **abaikan** teguran panjang baris ini.
2. **Analisa Logika Bisnis:** Jika panjang baris disebabkan oleh proses data yang kompleks (banyak `if/else`, *mapping* rumit, kalkulasi algoritma), **refaktor** logika tersebut menjadi *helper* eksternal atau *custom hooks* (jika di frontend).
3. **Pembaruan Laporan:** Laporan hasil audit dapat di-update di `docs/audits/AUDIT_CLEAN_CODE_REST_API_GUIDELINES.md` sebagai bukti bahwa pengecekan otomatis telah dilakukan.
