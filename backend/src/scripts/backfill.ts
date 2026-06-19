import prisma from '../config/prisma';

const formatScriptError = (error: unknown) =>
  error instanceof Error ? error.stack || error.message : String(error);

const scriptLogger = {
  error: (error: unknown) => process.stderr.write(`${formatScriptError(error)}\n`),
  info: (message: string) => process.stdout.write(`${message}\n`),
};

const categoryUpdates = [
  { name: 'Hotel', description: 'Akomodasi dengan layanan kamar/fasilitas harian.', default_rental_type: 'PER_ROOM' },
  { name: 'Apartemen', description: 'Unit tinggal modern, dapat dikelola sebagai unit/kamar.', default_rental_type: 'PER_ROOM' },
  { name: 'Rumah', description: 'Properti hunian yang disewakan sebagai satu unit utuh.', default_rental_type: 'WHOLE_PROPERTY' },
  { name: 'Villa', description: 'Properti liburan yang disewakan sebagai satu unit utuh.', default_rental_type: 'WHOLE_PROPERTY' },
  { name: 'Kost', description: 'Kamar sewa jangka pendek/menengah.', default_rental_type: 'PER_ROOM' },
] as const;

const updateCategories = async () => {
  for (const item of categoryUpdates) {
    await prisma.propertyCategory.updateMany({
      where: { name: item.name },
      data: {
        description: item.description,
        default_rental_type: item.default_rental_type,
      },
    });
    scriptLogger.info(`Updated category: ${item.name}`);
  }
};

const getRentalType = (categoryName: string) =>
  ['Rumah', 'Villa'].includes(categoryName) ? 'WHOLE_PROPERTY' : 'PER_ROOM';

const updatePropertyRentalType = (
  property: { id: string; category: { name: string } },
) => prisma.property.update({
  where: { id: property.id },
  data: { rental_type: getRentalType(property.category.name) },
});

const updatePropertyRentalTypes = async () => {
  const properties = await prisma.property.findMany({
    include: { category: true },
  });

  for (const property of properties) {
    await updatePropertyRentalType(property);
  }
  scriptLogger.info(`Updated rental_type for ${properties.length} properties`);
};

const backfill = async () => {
  scriptLogger.info('Starting backfill...');
  await updateCategories();
  await updatePropertyRentalTypes();
  scriptLogger.info('Backfill completed successfully!');
};

backfill()
  .catch(scriptLogger.error)
  .finally(() => prisma.$disconnect());
