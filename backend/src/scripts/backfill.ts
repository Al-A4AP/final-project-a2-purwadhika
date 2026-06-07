import prisma from '../config/prisma';

const backfill = async () => {
  console.log('Starting backfill...');
  
  const updates = [
    { name: 'Hotel', description: 'Akomodasi dengan layanan kamar/fasilitas harian.', default_rental_type: 'PER_ROOM' },
    { name: 'Apartemen', description: 'Unit tinggal modern, dapat dikelola sebagai unit/kamar.', default_rental_type: 'PER_ROOM' },
    { name: 'Rumah', description: 'Properti hunian yang disewakan sebagai satu unit utuh.', default_rental_type: 'WHOLE_PROPERTY' },
    { name: 'Villa', description: 'Properti liburan yang disewakan sebagai satu unit utuh.', default_rental_type: 'WHOLE_PROPERTY' },
    { name: 'Kost', description: 'Kamar sewa jangka pendek/menengah.', default_rental_type: 'PER_ROOM' },
  ] as const;

  for (const item of updates) {
    await prisma.propertyCategory.updateMany({
      where: { name: item.name },
      data: {
        description: item.description,
        default_rental_type: item.default_rental_type,
      },
    });
    console.log(`Updated category: ${item.name}`);
  }

  // Backfill existing properties
  const properties = await prisma.property.findMany({
    include: { category: true },
  });

  for (const property of properties) {
    if (['Rumah', 'Villa'].includes(property.category.name)) {
      await prisma.property.update({
        where: { id: property.id },
        data: { rental_type: 'WHOLE_PROPERTY' },
      });
    } else {
      await prisma.property.update({
        where: { id: property.id },
        data: { rental_type: 'PER_ROOM' },
      });
    }
  }
  console.log(`Updated rental_type for ${properties.length} properties`);

  console.log('Backfill completed successfully!');
};

backfill()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
