# Panduan Penamaan Resource REST API
> Guideline untuk **Property Renting Web App**  
> Referensi: [restfulapi.net/resource-naming](https://restfulapi.net/resource-naming/)

---

## 1. Apa Itu Resource?

Dalam REST, representasi data utama disebut **resource**. Memiliki strategi penamaan resource REST yang konsisten dan solid akan menjadi salah satu keputusan desain terbaik dalam jangka panjang.

> *"Abstraksi utama dari informasi dalam REST adalah resource. Informasi apa pun yang dapat diberi nama dapat menjadi resource: dokumen atau gambar, layanan temporal, kumpulan resource lain, objek non-virtual (misalnya, seseorang), dan sebagainya."*
> — Roy Fielding

Resource adalah **pemetaan konseptual** ke sekumpulan entitas, bukan entitas yang sesuai dengan pemetaan pada titik waktu tertentu.

---

### 1.1. Resource Singleton dan Collection

Resource bisa berupa **singleton** atau **collection**.

Contoh dalam konteks aplikasi penyewaan properti:

```
/properties           // collection resource (semua properti)
/properties/{id}      // singleton resource (satu properti)

/tenants              // collection resource (semua penyewa)
/tenants/{id}         // singleton resource (satu penyewa)
```

---

### 1.2. Resource Collection dan Sub-collection

Resource dapat memiliki sub-collection di dalamnya.

Contoh dalam konteks aplikasi penyewaan properti:

```
/properties                              // collection resource
/properties/{propertyId}/bookings        // sub-collection resource
/properties/{propertyId}/bookings/{bookingId}  // singleton di dalam sub-collection

/landlords                               // collection resource
/landlords/{landlordId}/properties       // sub-collection resource
```

---

### 1.3. URI (Uniform Resource Identifier)

REST API menggunakan **URI** untuk mengidentifikasi resource. URI yang dirancang dengan baik membuat API lebih intuitif dan mudah digunakan.

---

## 2. Best Practices

### 2.1. Gunakan Kata Benda (Noun) untuk Merepresentasikan Resource

URI RESTful harus merujuk pada **benda (noun)**, bukan tindakan (verb), karena resource memiliki atribut — seperti halnya benda.

**Contoh untuk Property Renting App:**

```
/property-management/properties
/property-management/properties/{property-id}

/user-management/tenants
/user-management/tenants/{id}

/user-management/landlords
/user-management/landlords/{id}

/booking-management/bookings
/booking-management/bookings/{booking-id}
```

---

#### 2.1.1. Document

Resource **document** adalah konsep tunggal, mirip dengan instance objek atau record database. Gunakan nama **singular** untuk tipe ini.

```
/properties/{property-id}
/tenants/{tenant-id}
/bookings/{booking-id}/invoice
/users/admin
```

---

#### 2.1.2. Collection

Resource **collection** adalah direktori resource yang dikelola server. Gunakan nama **plural** untuk tipe ini.

```
/properties
/tenants
/landlords
/bookings
/properties/{property-id}/reviews
/tenants/{tenant-id}/bookings
```

---

#### 2.1.3. Store

**Store** adalah repositori resource yang dikelola oleh client. Client bisa memasukkan, mengambil, dan menghapus resource. Gunakan nama **plural** untuk tipe ini.

```
/users/{id}/saved-properties       // properti yang disimpan/difavoritkan user
/users/{id}/wishlists
```

---

### 2.2. Konsistensi adalah Kunci

Gunakan konvensi penamaan resource dan format URI yang konsisten untuk meminimalkan ambiguitas dan memaksimalkan keterbacaan.

#### 2.2.1. Gunakan Garis Miring (/) untuk Menunjukkan Hierarki

```
/property-management
/property-management/properties
/property-management/properties/{id}
/property-management/properties/{id}/rooms
/property-management/properties/{id}/rooms/{room-id}
```

#### 2.2.2. Jangan Gunakan Trailing Slash (/) di Akhir URI

```
# JANGAN
/property-management/properties/

# GUNAKAN
/property-management/properties
```

#### 2.2.3. Gunakan Tanda Hubung (-) untuk Meningkatkan Keterbacaan URI

```
# JANGAN
/propertymanagement/managedproperties/

# GUNAKAN
/property-management/managed-properties
```

#### 2.2.4. Jangan Gunakan Underscore ( _ )

Underscore bisa tersembunyi atau terpotong tergantung pada font yang digunakan browser.

```
# JANGAN
/booking_management/active_bookings/{id}/payment_status

# GUNAKAN
/booking-management/active-bookings/{id}/payment-status
```

#### 2.2.5. Gunakan Huruf Kecil di URI

```
# BENAR
/property-management/properties

# SALAH
/Property-Management/Properties

# PERHATIAN: Berbeda dengan yang pertama (My-Folder ≠ my-folder)
/Property-management/properties
```

---

### 2.3. Jangan Gunakan Ekstensi File

Ekstensi file membuat URI terlihat buruk dan tidak ada manfaatnya. Gunakan header `Content-Type` untuk menentukan format data.

```
# JANGAN
/property-management/properties.json
/property-management/properties.xml

# GUNAKAN
/property-management/properties
```

---

### 2.4. Jangan Gunakan Nama Fungsi CRUD di URI

URI hanya digunakan untuk **mengidentifikasi resource**, bukan untuk mendeskripsikan aksi. Gunakan **HTTP method** untuk menyatakan aksi.

```
# JANGAN (gaya RPC, bukan REST)
GET  /properties/getAll
POST /properties/createNew
PUT  /properties/updateProperty/{id}
DELETE /properties/deleteProperty/{id}

# GUNAKAN (RESTful)
GET    /properties                  // Ambil semua properti
POST   /properties                  // Buat properti baru
GET    /properties/{id}             // Ambil properti berdasarkan ID
PUT    /properties/{id}             // Update properti berdasarkan ID
DELETE /properties/{id}             // Hapus properti berdasarkan ID
```

---

### 2.5. Gunakan Query Parameter untuk Filter, Sorting, dan Pagination

Jangan buat endpoint baru hanya untuk kebutuhan filter atau sorting. Gunakan **query parameter** pada endpoint collection yang sudah ada.

```
/properties
/properties?city=bandung
/properties?city=bandung&type=apartment
/properties?city=bandung&type=apartment&sort=price
/properties?city=bandung&min-price=500000&max-price=2000000
/properties?status=available&sort=created-at&page=1&limit=10

/bookings?status=pending
/bookings?tenant-id={id}&status=active
```

---

## 3. Jangan Gunakan Verb di URI

REST menggunakan **noun** untuk resource, dan **HTTP method** sebagai verb. Jika ada verb di URI, kemungkinan besar itu adalah gaya RPC, bukan REST.

```
# JANGAN - Ini adalah RPC, bukan REST
/properties/{id}/activate
/bookings/{id}/cancel
/payments/{id}/process

# GUNAKAN - noun sebagai representasi state/aksi
POST /properties/{id}/status          // body: { "action": "activate" }
POST /bookings/{id}/cancellations     // membuat resource "pembatalan"
POST /payments/{id}/transactions      // membuat resource "transaksi"
```

---

## 4. Referensi URI untuk Property Renting Web App

Berikut adalah contoh desain URI lengkap yang mengikuti panduan di atas:

### Properties
```
GET    /properties                                   // List semua properti
POST   /properties                                   // Tambah properti baru
GET    /properties/{property-id}                     // Detail properti
PUT    /properties/{property-id}                     // Update properti
DELETE /properties/{property-id}                     // Hapus properti
GET    /properties/{property-id}/rooms               // List kamar di properti
POST   /properties/{property-id}/rooms               // Tambah kamar baru
GET    /properties/{property-id}/rooms/{room-id}     // Detail kamar
GET    /properties/{property-id}/reviews             // Ulasan properti
POST   /properties/{property-id}/reviews             // Tambah ulasan
```

### Bookings
```
GET    /bookings                                     // List semua booking
POST   /bookings                                     // Buat booking baru
GET    /bookings/{booking-id}                        // Detail booking
PUT    /bookings/{booking-id}                        // Update booking
GET    /bookings/{booking-id}/payments               // List pembayaran booking
POST   /bookings/{booking-id}/payments               // Tambah pembayaran
```

### Tenants & Landlords
```
GET    /tenants                                      // List semua penyewa
POST   /tenants                                      // Daftarkan penyewa baru
GET    /tenants/{tenant-id}                          // Detail penyewa
PUT    /tenants/{tenant-id}                          // Update data penyewa
GET    /tenants/{tenant-id}/bookings                 // Riwayat booking penyewa

GET    /landlords                                    // List semua pemilik properti
POST   /landlords                                    // Daftarkan pemilik baru
GET    /landlords/{landlord-id}                      // Detail pemilik
GET    /landlords/{landlord-id}/properties           // Properti milik landlord
```

### Users & Auth
```
POST   /auth/login
POST   /auth/logout
POST   /auth/register
POST   /auth/refresh-token

GET    /users/{id}
PUT    /users/{id}
GET    /users/{id}/saved-properties                  // Properti favorit user
```

---

## 5. Kesimpulan

| Prinsip | Aturan |
|---|---|
| Gunakan noun, bukan verb | `/properties` bukan `/getProperties` |
| Plural untuk collection | `/bookings`, `/tenants`, `/properties` |
| Singular untuk document | `/properties/{id}`, `/users/admin` |
| Lowercase selalu | `/property-management` bukan `/PropertyManagement` |
| Gunakan hyphen (-) | `/managed-properties` bukan `/managed_properties` |
| Tidak ada trailing slash | `/properties` bukan `/properties/` |
| Tidak ada ekstensi file | `/properties` bukan `/properties.json` |
| HTTP method sebagai aksi | `DELETE /properties/{id}` bukan `GET /deleteProperty/{id}` |
| Filter via query param | `/properties?city=bandung&type=apartment` |

> Resource adalah **benda (noun)**. Setiap kali tergoda memasukkan verb ke dalam URI, itu pertanda sedang membuat RPC call, bukan REST endpoint.
