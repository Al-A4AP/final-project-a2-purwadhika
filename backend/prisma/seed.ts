import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

// Init Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Init Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

// ==================== HELPERS ====================

async function uploadImg(url: string, folder = 'proprrent'): Promise<{ url: string; public_id: string }> {
  try {
    const result = await cloudinary.uploader.upload(url, { folder });
    console.log(`  ✓ Uploaded: ${result.public_id}`);
    return { url: result.secure_url, public_id: result.public_id };
  } catch (e) {
    console.warn(`  ✗ Upload gagal, gunakan URL original: ${url}`);
    return { url, public_id: '' };
  }
}

function genOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

function daysFromNow(n: number): Date {
  return new Date(Date.now() + n * 86400000);
}

// ==================== IMAGE SOURCES ====================
// Unsplash photos - reliable direct links
const IMG = {
  hotel1: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  hotel2: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
  hotel3: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
  apt1:   'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  apt2:   'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  apt3:   'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  villa1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
  villa2: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
  villa3: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  kost1:  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  kost2:  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  kost3:  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
};

// ==================== MAIN SEED ====================
async function main() {
  console.log('\n🌱 Memulai seeding database...\n');

  // 1. Clean up existing data (urutan penting!)
  console.log('🗑️  Membersihkan data lama...');
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.peakSeasonRate.deleteMany();
  await prisma.roomAvailability.deleteMany();
  await prisma.room.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.propertyCategory.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Data lama dihapus\n');

  // 2. CATEGORIES
  console.log('📂 Membuat kategori properti...');
  const [catHotel, catApt, catRumah, catVilla, catKost] = await Promise.all([
    prisma.propertyCategory.create({ data: { name: 'Hotel', icon: '🏨' } }),
    prisma.propertyCategory.create({ data: { name: 'Apartemen', icon: '🏢' } }),
    prisma.propertyCategory.create({ data: { name: 'Rumah', icon: '🏠' } }),
    prisma.propertyCategory.create({ data: { name: 'Villa', icon: '🏡' } }),
    prisma.propertyCategory.create({ data: { name: 'Kost', icon: '🏘️' } }),
  ]);
  console.log('  ✓ 5 kategori dibuat\n');

  // 3. USERS
  console.log(' Membuat users...');
  const passwordHash = await bcryptjs.hash('Password123!', 10);
  const now = new Date();

  const [tenant, user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'tenant@proprrent.com',
        password_hash: passwordHash,
        role: 'TENANT',
        name: 'Budi Santoso (Tenant)',
        phone: '08111234567',
        verified_at: now,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user1@proprrent.com',
        password_hash: passwordHash,
        role: 'USER',
        name: 'Siti Rahayu',
        phone: '08222345678',
        verified_at: now,
      },
    }),
    prisma.user.create({
      data: {
        email: 'user2@proprrent.com',
        password_hash: passwordHash,
        role: 'USER',
        name: 'Andi Pratama',
        phone: '08333456789',
        verified_at: now,
      },
    }),
  ]);
  console.log('  ✓ 3 users dibuat (password: Password123!)\n');

  // 4. UPLOAD IMAGES TO CLOUDINARY
  console.log(' Upload gambar ke Cloudinary...');
  const [imgH1, imgH2, imgH3, imgA1, imgA2, imgA3, imgV1, imgV2, imgV3, imgK1, imgK2, imgK3] =
    await Promise.all([
      uploadImg(IMG.hotel1), uploadImg(IMG.hotel2), uploadImg(IMG.hotel3),
      uploadImg(IMG.apt1),   uploadImg(IMG.apt2),   uploadImg(IMG.apt3),
      uploadImg(IMG.villa1), uploadImg(IMG.villa2), uploadImg(IMG.villa3),
      uploadImg(IMG.kost1),  uploadImg(IMG.kost2),  uploadImg(IMG.kost3),
    ]);
  console.log('  ✓ 12 gambar diupload ke Cloudinary\n');

  // 5. PROPERTIES
  console.log(' Membuat properti...');

  const propData = [
    {
      name: 'Grand Menteng Hotel',
      description: 'Hotel bintang 5 di pusat Jakarta dengan fasilitas lengkap, kolam renang rooftop, spa, dan restoran fine dining. Dekat dengan pusat bisnis Sudirman.',
      city: 'Jakarta',
      address: 'Jl. H. Agus Salim No.12, Menteng, Jakarta Pusat',
      latitude: -6.1944, longitude: 106.8343,
      categoryId: catHotel.id,
      featured: imgH1.url,
      images: [imgH1, imgH2, imgH3],
    },
    {
      name: 'Hotel Malioboro Indah',
      description: 'Hotel butik dengan nuansa Jawa yang kental, berlokasi 100 meter dari Malioboro. Sarapan prasmanan, wifi gratis, dan concierge wisata tersedia.',
      city: 'Yogyakarta',
      address: 'Jl. Malioboro No.47, Yogyakarta',
      latitude: -7.7956, longitude: 110.3695,
      categoryId: catHotel.id,
      featured: imgH2.url,
      images: [imgH2, imgH1],
    },
    {
      name: 'Skyline Apartemen Sudirman',
      description: 'Apartemen modern di tower Sudirman dengan view kota yang memukau. Fully furnished, akses 24 jam, parkir, dan gym tersedia.',
      city: 'Jakarta',
      address: 'Jl. Jend. Sudirman Kav 55, Jakarta Selatan',
      latitude: -6.2141, longitude: 106.8195,
      categoryId: catApt.id,
      featured: imgA1.url,
      images: [imgA1, imgA2, imgA3],
    },
    {
      name: 'Apartemen Surabaya Center',
      description: 'Apartemen strategis di jantung kota Surabaya. Dekat pusat perbelanjaan, rumah sakit, dan universitas. Unit bersih dan terawat.',
      city: 'Surabaya',
      address: 'Jl. Pemuda No.31, Gubeng, Surabaya',
      latitude: -7.2576, longitude: 112.7521,
      categoryId: catApt.id,
      featured: imgA2.url,
      images: [imgA2, imgA3],
    },
    {
      name: 'Villa Ubud Hijau',
      description: 'Villa eksklusif di tengah sawah Ubud dengan kolam renang pribadi, bale bengong, dan pemandangan gunung. Pengalaman Bali yang autentik.',
      city: 'Bali',
      address: 'Jl. Suweta No.8, Ubud, Gianyar, Bali',
      latitude: -8.5069, longitude: 115.2625,
      categoryId: catVilla.id,
      featured: imgV1.url,
      images: [imgV1, imgV2, imgV3],
    },
    {
      name: 'Rumah Tepi Pantai Lombok',
      description: 'Rumah sewa beachfront di Lombok dengan akses langsung ke pantai pasir putih. Cocok untuk keluarga, BBQ area, dan hammock tersedia.',
      city: 'Lombok',
      address: 'Jl. Pantai Selong Belanak, Lombok Tengah',
      latitude: -8.8556, longitude: 116.2131,
      categoryId: catRumah.id,
      featured: imgV2.url,
      images: [imgV2, imgV3],
    },
    {
      name: 'Kost Premium Bandung',
      description: 'Kost eksklusif di Bandung dengan fasilitas AC, WiFi, kamar mandi dalam, dan pantry. Lingkungan aman, dekat ITB dan kampus lainnya.',
      city: 'Bandung',
      address: 'Jl. Ganesha No.10, Coblong, Bandung',
      latitude: -6.8914, longitude: 107.6107,
      categoryId: catKost.id,
      featured: imgK1.url,
      images: [imgK1, imgK2],
    },
    {
      name: 'Kost Eksklusif Semarang',
      description: 'Kost modern di Semarang Tengah, dekat Simpang Lima. Kamar spacious dengan lemari, meja belajar, AC, dan kamar mandi private.',
      city: 'Semarang',
      address: 'Jl. Pahlawan No.22, Semarang Tengah',
      latitude: -6.9824, longitude: 110.4100,
      categoryId: catKost.id,
      featured: imgK2.url,
      images: [imgK2, imgK3],
    },
  ];

  const properties = [];
  for (const p of propData) {
    const prop = await prisma.property.create({
      data: {
        tenantId: tenant.id,
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        city: p.city,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        featured_image_url: p.featured,
        images: {
          create: p.images.map((img, idx) => ({
            image_url: img.url,
            cloudinary_public_id: img.public_id,
            order: idx,
          })),
        },
      },
    });
    properties.push(prop);
    console.log(`  ✓ ${prop.name}`);
  }
  console.log(`  ✓ ${properties.length} properti dibuat\n`);

  // 6. ROOMS (25 total)
  console.log('🛏️  Membuat kamar...');
  const roomsData = [
    // Grand Menteng Hotel (idx 0)
    { propIdx: 0, type: 'Superior Room', price: 850000, cap: 2, desc: 'Kamar superior dengan pemandangan kota, TV LED 43 inch, minibar' },
    { propIdx: 0, type: 'Deluxe Room', price: 1200000, cap: 2, desc: 'Kamar deluxe dengan bathtub dan balkon' },
    { propIdx: 0, type: 'Junior Suite', price: 2000000, cap: 3, desc: 'Suite mewah dengan ruang tamu terpisah' },
    // Hotel Malioboro (idx 1)
    { propIdx: 1, type: 'Kamar Standar', price: 500000, cap: 2, desc: 'Kamar nyaman dengan sentuhan budaya Jawa' },
    { propIdx: 1, type: 'Kamar Deluxe', price: 750000, cap: 3, desc: 'Kamar lebih luas dengan bathtub antik' },
    // Skyline Apt (idx 2)
    { propIdx: 2, type: 'Studio Unit', price: 950000, cap: 2, desc: 'Unit studio 28m², fully furnished, dapur lengkap' },
    { propIdx: 2, type: '1BR Unit', price: 1500000, cap: 3, desc: 'Unit 1 kamar tidur 45m² dengan ruang tamu' },
    { propIdx: 2, type: '2BR Unit', price: 2500000, cap: 5, desc: 'Unit 2 kamar tidur 70m², cocok untuk keluarga' },
    // Apt Surabaya (idx 3)
    { propIdx: 3, type: 'Studio', price: 700000, cap: 2, desc: 'Studio bersih dekat pusat kota' },
    { propIdx: 3, type: '1 Bedroom', price: 1100000, cap: 3, desc: 'Unit 1 kamar tidur dengan view kota' },
    // Villa Ubud (idx 4) - 1 unit sewa seluruh villa
    { propIdx: 4, type: 'Seluruh Villa Ubud Hijau', price: 3500000, cap: 8, desc: 'Sewa eksklusif seluruh villa dengan kolam renang pribadi, bale bengong, dan pemandangan sawah Ubud. Termasuk 3 kamar tidur.' },
    // Rumah Lombok (idx 5) - 1 unit sewa seluruh rumah
    { propIdx: 5, type: 'Seluruh Rumah Tepi Pantai', price: 3000000, cap: 10, desc: 'Sewa seluruh rumah beachfront 4 kamar tidur dengan akses langsung ke pantai, BBQ area, dan hammock.' },
    // Kost Bandung (idx 6)
    { propIdx: 6, type: 'Kamar Standard', price: 1800000, cap: 1, desc: 'Kamar per bulan - AC, WiFi, KM dalam' },
    { propIdx: 6, type: 'Kamar Premium', price: 2300000, cap: 1, desc: 'Kamar lebih luas dengan sofa dan kulkas mini' },
    // Kost Semarang (idx 7)
    { propIdx: 7, type: 'Kamar Reguler', price: 1500000, cap: 1, desc: 'Kamar bersih AC dan KM private' },
    { propIdx: 7, type: 'Kamar Deluxe', price: 2000000, cap: 1, desc: 'Kamar deluxe dengan tempat tidur queen dan meja kerja besar' },
  ];

  const rooms = [];
  for (const r of roomsData) {
    const room = await prisma.room.create({
      data: {
        propertyId: properties[r.propIdx].id,
        room_type: r.type,
        base_price: r.price,
        capacity: r.cap,
        description: r.desc,
      },
    });
    rooms.push(room);
  }
  console.log(`  ✓ ${rooms.length} kamar dibuat\n`);

  // 7. PEAK SEASON RATES
  console.log('Membuat peak season rates...');
  await prisma.peakSeasonRate.createMany({
    data: [
      { roomId: rooms[0].id, start_date: new Date('2026-12-20'), end_date: new Date('2027-01-05'), rate_type: 'PERCENTAGE', rate_value: 50, description: 'Libur Natal & Tahun Baru' },
      { roomId: rooms[1].id, start_date: new Date('2026-12-20'), end_date: new Date('2027-01-05'), rate_type: 'PERCENTAGE', rate_value: 50, description: 'Libur Natal & Tahun Baru' },
      { roomId: rooms[10].id, start_date: new Date('2026-07-01'), end_date: new Date('2026-07-31'), rate_type: 'NOMINAL', rate_value: 500000, description: 'High season Bali Juli' },
    ],
  });
  console.log('  ✓ Peak season rates dibuat\n');

  // 8. ORDERS
  console.log(' Membuat orders...');
  const ordersData = [
    // Completed orders (untuk review)
    { userId: user1.id, roomIdx: 0,  propIdx: 0, checkIn: daysAgo(30), checkOut: daysAgo(28), nights: 2, status: 'PROCESSED' as const },
    { userId: user1.id, roomIdx: 4,  propIdx: 1, checkIn: daysAgo(20), checkOut: daysAgo(18), nights: 2, status: 'PROCESSED' as const },
    { userId: user2.id, roomIdx: 10, propIdx: 4, checkIn: daysAgo(15), checkOut: daysAgo(12), nights: 3, status: 'PROCESSED' as const },
    { userId: user2.id, roomIdx: 5,  propIdx: 2, checkIn: daysAgo(10), checkOut: daysAgo(8),  nights: 2, status: 'PROCESSED' as const },
    // Active orders
    { userId: user1.id, roomIdx: 10, propIdx: 4, checkIn: daysFromNow(5),  checkOut: daysFromNow(8),  nights: 3, status: 'WAITING_PAYMENT' as const },
    { userId: user2.id, roomIdx: 1,  propIdx: 0, checkIn: daysFromNow(7),  checkOut: daysFromNow(9),  nights: 2, status: 'WAITING_CONFIRMATION' as const },
    { userId: user1.id, roomIdx: 11, propIdx: 5, checkIn: daysFromNow(10), checkOut: daysFromNow(12), nights: 2, status: 'WAITING_PAYMENT' as const },
    { userId: user2.id, roomIdx: 6,  propIdx: 2, checkIn: daysFromNow(3),  checkOut: daysFromNow(5),  nights: 2, status: 'PROCESSED' as const },
    // Cancelled
    { userId: user1.id, roomIdx: 3,  propIdx: 1, checkIn: daysAgo(5), checkOut: daysAgo(3), nights: 2, status: 'CANCELLED' as const },
    { userId: user2.id, roomIdx: 8,  propIdx: 3, checkIn: daysFromNow(15), checkOut: daysFromNow(17), nights: 2, status: 'WAITING_PAYMENT' as const },
  ];

  const orders = [];
  for (const o of ordersData) {
    const room = rooms[o.roomIdx];
    const total = room.base_price * o.nights;
    const order = await prisma.order.create({
      data: {
        order_number: genOrderNumber(),
        userId: o.userId,
        roomId: room.id,
        propertyId: properties[o.propIdx].id,
        check_in_date: o.checkIn,
        check_out_date: o.checkOut,
        total_price: total,
        status: o.status,
        payment_method: 'MANUAL',
        payment_verified_at: o.status === 'PROCESSED' ? daysAgo(1) : null,
        canceled_at: o.status === 'CANCELLED' ? daysAgo(4) : null,
      },
    });
    orders.push(order);
  }
  console.log(`  ✓ ${orders.length} orders dibuat\n`);

  // 9. REVIEWS (untuk PROCESSED orders)
  console.log('Membuat reviews...');
  const processedOrders = orders.filter((_, i) => ordersData[i].status === 'PROCESSED');
  const reviewsData = [
    { rating: 5, comment: 'Hotel sangat mewah! Pelayanan staf ramah, kamar bersih, dan lokasi strategis. Pasti akan kembali lagi.' },
    { rating: 4, comment: 'Hotel bagus dengan nuansa Jawa yang kental. Sarapannya enak. Sedikit jauh dari pusat kota.' },
    { rating: 5, comment: 'Villa terbaik yang pernah saya coba! View sawah Ubud yang memukau, kolam renang private sangat nyaman.' },
    { rating: 4, comment: 'Apartemen bersih dan modern. Fasilitasnya lengkap, gym bagus. Parkir sedikit terbatas.' },
    { rating: 5, comment: 'Sangat puas! Kamar nyaman, WiFi kencang, lokasi dekat kampus.' },
  ];

  const reviews = [];
  for (let i = 0; i < Math.min(processedOrders.length, reviewsData.length); i++) {
    const ord = processedOrders[i];
    const ordData = ordersData[orders.indexOf(ord)];
    const review = await prisma.review.create({
      data: {
        orderId: ord.id,
        propertyId: properties[ordData.propIdx].id,
        userId: ord.userId,
        rating: reviewsData[i].rating,
        comment: reviewsData[i].comment,
      },
    });
    reviews.push(review);
  }
  console.log(`  ✓ ${reviews.length} reviews dibuat\n`);

  // 10. REVIEW REPLIES (tenant balas 2 review)
  console.log(' Membuat review replies...');
  if (reviews.length >= 2) {
    await prisma.reviewReply.createMany({
      data: [
        { reviewId: reviews[0].id, tenantId: tenant.id, reply_text: 'Terima kasih atas reviewnya! Kami sangat senang Anda puas. Sampai jumpa kembali 🙏' },
        { reviewId: reviews[2].id, tenantId: tenant.id, reply_text: 'Terima kasih sudah memilih Villa Ubud Hijau! Senang Anda menikmati kolam renang kami. Salam dari Ubud 🌿' },
      ],
    });
    console.log('  ✓ 2 review replies dibuat\n');
  }

  // SUMMARY
  console.log('Seeding selesai!\n');
  console.log('='.repeat(50));
  console.log(' Summary:');
  console.log(`  Users     : 3 (tenant@proprrent.com, user1@, user2@)`);
  console.log(`  Properties: ${properties.length}`);
  console.log(`  Rooms     : ${rooms.length}`);
  console.log(`  Orders    : ${orders.length}`);
  console.log(`  Reviews   : ${reviews.length}`);
  console.log(`  Images    : 12 (Cloudinary)`);
  console.log('  Password  : Password123!');
  console.log('='.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
