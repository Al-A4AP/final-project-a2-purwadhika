import type { OrderStatus } from '@prisma/client';

export const DEFAULT_PASSWORD = 'Password123!';

export const CATEGORY_NAMES = [
  'Hotel',
  'Apartemen',
  'Rumah',
  'Villa',
  'Kost',
] as const;

export const IMAGE_URLS = {
  hotel1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  hotel2: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  hotel3: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  apt1: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  apt2: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  apt3: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  villa1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  villa2: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
  villa3: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  kost1: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  kost2: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  kost3: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
} as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];
export type ImageKey = keyof typeof IMAGE_URLS;

export const USER_SEEDS = [
  { key: 'tenant', email: 'tenant@proprrent.com', role: 'TENANT', name: 'Budi Santoso (Tenant)', phone: '08111234567' },
  { key: 'user1', email: 'user1@proprrent.com', role: 'USER', name: 'Siti Rahayu', phone: '08222345678' },
  { key: 'user2', email: 'user2@proprrent.com', role: 'USER', name: 'Andi Pratama', phone: '08333456789' },
] as const;

export const PROPERTY_SEEDS = [
  {
    name: 'Grand Menteng Hotel',
    description: 'Hotel bintang 5 di pusat Jakarta dengan fasilitas lengkap, kolam renang rooftop, spa, dan restoran fine dining. Dekat dengan pusat bisnis Sudirman.',
    city: 'Jakarta',
    address: 'Jl. H. Agus Salim No.12, Menteng, Jakarta Pusat',
    latitude: -6.1944,
    longitude: 106.8343,
    category: 'Hotel',
    featured: 'hotel1',
    images: ['hotel1', 'hotel2', 'hotel3'],
  },
  {
    name: 'Hotel Malioboro Indah',
    description: 'Hotel butik dengan nuansa Jawa yang kental, berlokasi 100 meter dari Malioboro. Sarapan prasmanan, wifi gratis, dan concierge wisata tersedia.',
    city: 'Yogyakarta',
    address: 'Jl. Malioboro No.47, Yogyakarta',
    latitude: -7.7956,
    longitude: 110.3695,
    category: 'Hotel',
    featured: 'hotel2',
    images: ['hotel2', 'hotel1'],
  },
  {
    name: 'Skyline Apartemen Sudirman',
    description: 'Apartemen modern di tower Sudirman dengan view kota yang memukau. Fully furnished, akses 24 jam, parkir, dan gym tersedia.',
    city: 'Jakarta',
    address: 'Jl. Jend. Sudirman Kav 55, Jakarta Selatan',
    latitude: -6.2141,
    longitude: 106.8195,
    category: 'Apartemen',
    featured: 'apt1',
    images: ['apt1', 'apt2', 'apt3'],
  },
  {
    name: 'Apartemen Surabaya Center',
    description: 'Apartemen strategis di jantung kota Surabaya. Dekat pusat perbelanjaan, rumah sakit, dan universitas. Unit bersih dan terawat.',
    city: 'Surabaya',
    address: 'Jl. Pemuda No.31, Gubeng, Surabaya',
    latitude: -7.2576,
    longitude: 112.7521,
    category: 'Apartemen',
    featured: 'apt2',
    images: ['apt2', 'apt3'],
  },
  {
    name: 'Villa Ubud Hijau',
    description: 'Villa eksklusif di tengah sawah Ubud dengan kolam renang pribadi, bale bengong, dan pemandangan gunung. Pengalaman Bali yang autentik.',
    city: 'Bali',
    address: 'Jl. Suweta No.8, Ubud, Gianyar, Bali',
    latitude: -8.5069,
    longitude: 115.2625,
    category: 'Villa',
    featured: 'villa1',
    images: ['villa1', 'villa2', 'villa3'],
  },
  {
    name: 'Rumah Tepi Pantai Lombok',
    description: 'Rumah sewa beachfront di Lombok dengan akses langsung ke pantai pasir putih. Cocok untuk keluarga, BBQ area, dan hammock tersedia.',
    city: 'Lombok',
    address: 'Jl. Pantai Selong Belanak, Lombok Tengah',
    latitude: -8.8556,
    longitude: 116.2131,
    category: 'Rumah',
    featured: 'villa2',
    images: ['villa2', 'villa3'],
  },
  {
    name: 'Kost Premium Bandung',
    description: 'Kost eksklusif di Bandung dengan fasilitas AC, WiFi, kamar mandi dalam, dan pantry. Lingkungan aman, dekat ITB dan kampus lainnya.',
    city: 'Bandung',
    address: 'Jl. Ganesha No.10, Coblong, Bandung',
    latitude: -6.8914,
    longitude: 107.6107,
    category: 'Kost',
    featured: 'kost1',
    images: ['kost1', 'kost2'],
  },
  {
    name: 'Kost Eksklusif Semarang',
    description: 'Kost modern di Semarang Tengah, dekat Simpang Lima. Kamar spacious dengan lemari, meja belajar, AC, dan kamar mandi private.',
    city: 'Semarang',
    address: 'Jl. Pahlawan No.22, Semarang Tengah',
    latitude: -6.9824,
    longitude: 110.41,
    category: 'Kost',
    featured: 'kost2',
    images: ['kost2', 'kost3'],
  },
] satisfies Array<{
  name: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  category: CategoryName;
  featured: ImageKey;
  images: ImageKey[];
}>;

export const ROOM_SEEDS = [
  { propertyIndex: 0, room_type: 'Superior Room', base_price: 850000, capacity: 2, description: 'Kamar superior dengan pemandangan kota, TV LED 43 inch, minibar' },
  { propertyIndex: 0, room_type: 'Deluxe Room', base_price: 1200000, capacity: 2, description: 'Kamar deluxe dengan bathtub dan balkon' },
  { propertyIndex: 0, room_type: 'Junior Suite', base_price: 2000000, capacity: 3, description: 'Suite mewah dengan ruang tamu terpisah' },
  { propertyIndex: 1, room_type: 'Kamar Standar', base_price: 500000, capacity: 2, description: 'Kamar nyaman dengan sentuhan budaya Jawa' },
  { propertyIndex: 1, room_type: 'Kamar Deluxe', base_price: 750000, capacity: 3, description: 'Kamar lebih luas dengan bathtub antik' },
  { propertyIndex: 2, room_type: 'Studio Unit', base_price: 950000, capacity: 2, description: 'Unit studio 28m2, fully furnished, dapur lengkap' },
  { propertyIndex: 2, room_type: '1BR Unit', base_price: 1500000, capacity: 3, description: 'Unit 1 kamar tidur 45m2 dengan ruang tamu' },
  { propertyIndex: 2, room_type: '2BR Unit', base_price: 2500000, capacity: 5, description: 'Unit 2 kamar tidur 70m2, cocok untuk keluarga' },
  { propertyIndex: 3, room_type: 'Studio', base_price: 700000, capacity: 2, description: 'Studio bersih dekat pusat kota' },
  { propertyIndex: 3, room_type: '1 Bedroom', base_price: 1100000, capacity: 3, description: 'Unit 1 kamar tidur dengan view kota' },
  { propertyIndex: 4, room_type: 'Seluruh Villa Ubud Hijau', base_price: 3500000, capacity: 8, description: 'Sewa eksklusif seluruh villa dengan kolam renang pribadi, bale bengong, dan pemandangan sawah Ubud. Termasuk 3 kamar tidur.' },
  { propertyIndex: 5, room_type: 'Seluruh Rumah Tepi Pantai', base_price: 3000000, capacity: 10, description: 'Sewa seluruh rumah beachfront 4 kamar tidur dengan akses langsung ke pantai, BBQ area, dan hammock.' },
  { propertyIndex: 6, room_type: 'Kamar Standard', base_price: 1800000, capacity: 1, description: 'Kamar per bulan - AC, WiFi, KM dalam' },
  { propertyIndex: 6, room_type: 'Kamar Premium', base_price: 2300000, capacity: 1, description: 'Kamar lebih luas dengan sofa dan kulkas mini' },
  { propertyIndex: 7, room_type: 'Kamar Reguler', base_price: 1500000, capacity: 1, description: 'Kamar bersih AC dan KM private' },
  { propertyIndex: 7, room_type: 'Kamar Deluxe', base_price: 2000000, capacity: 1, description: 'Kamar deluxe dengan tempat tidur queen dan meja kerja besar' },
] as const;

export const ORDER_SEEDS = [
  { userKey: 'user1', roomIndex: 0, propertyIndex: 0, checkInOffset: -30, checkOutOffset: -28, nights: 2, status: 'PROCESSED' },
  { userKey: 'user1', roomIndex: 4, propertyIndex: 1, checkInOffset: -20, checkOutOffset: -18, nights: 2, status: 'PROCESSED' },
  { userKey: 'user2', roomIndex: 10, propertyIndex: 4, checkInOffset: -15, checkOutOffset: -12, nights: 3, status: 'PROCESSED' },
  { userKey: 'user2', roomIndex: 5, propertyIndex: 2, checkInOffset: -10, checkOutOffset: -8, nights: 2, status: 'PROCESSED' },
  { userKey: 'user1', roomIndex: 10, propertyIndex: 4, checkInOffset: 5, checkOutOffset: 8, nights: 3, status: 'WAITING_PAYMENT' },
  { userKey: 'user2', roomIndex: 1, propertyIndex: 0, checkInOffset: 7, checkOutOffset: 9, nights: 2, status: 'WAITING_CONFIRMATION' },
  { userKey: 'user1', roomIndex: 11, propertyIndex: 5, checkInOffset: 10, checkOutOffset: 12, nights: 2, status: 'WAITING_PAYMENT' },
  { userKey: 'user2', roomIndex: 6, propertyIndex: 2, checkInOffset: 3, checkOutOffset: 5, nights: 2, status: 'PROCESSED' },
  { userKey: 'user1', roomIndex: 3, propertyIndex: 1, checkInOffset: -5, checkOutOffset: -3, nights: 2, status: 'CANCELLED' },
  { userKey: 'user2', roomIndex: 8, propertyIndex: 3, checkInOffset: 15, checkOutOffset: 17, nights: 2, status: 'WAITING_PAYMENT' },
] satisfies Array<{
  userKey: 'user1' | 'user2';
  roomIndex: number;
  propertyIndex: number;
  checkInOffset: number;
  checkOutOffset: number;
  nights: number;
  status: OrderStatus;
}>;

export const REVIEW_SEEDS = [
  { rating: 5, comment: 'Hotel sangat mewah! Pelayanan staf ramah, kamar bersih, dan lokasi strategis. Pasti akan kembali lagi.' },
  { rating: 4, comment: 'Hotel bagus dengan nuansa Jawa yang kental. Sarapannya enak. Sedikit jauh dari pusat kota.' },
  { rating: 5, comment: 'Villa terbaik yang pernah saya coba! View sawah Ubud yang memukau, kolam renang private sangat nyaman.' },
  { rating: 4, comment: 'Apartemen bersih dan modern. Fasilitasnya lengkap, gym bagus. Parkir sedikit terbatas.' },
  { rating: 5, comment: 'Sangat puas! Kamar nyaman, WiFi kencang, lokasi dekat kampus.' },
] as const;
