import 'dotenv/config';
import prisma from '../src/config/prisma';
import { uploadSeedImages } from './seed/assets';
import { createCategories } from './seed/categories';
import { clearDatabase } from './seed/cleanup';
import { createOrders } from './seed/orders';
import { createPeakRates } from './seed/peakRates';
import { createProperties } from './seed/properties';
import { createReviewReplies, createReviews } from './seed/reviews';
import { createRooms } from './seed/rooms';
import { printSummary } from './seed/summary';
import { createUsers } from './seed/users';
import { log, logError } from './seed/log';

const seedDatabase = async () => {
  log('Memulai seeding database...');
  await clearDatabase(prisma);
  const categories = await createCategories(prisma);
  const users = await createUsers(prisma);
  const images = await uploadSeedImages();
  const properties = await createProperties(prisma, users.tenant.id, categories, images);
  const rooms = await createRooms(prisma, properties);
  await createPeakRates(prisma, rooms);
  const orders = await createOrders(prisma, users, properties, rooms);
  const reviews = await createReviews(prisma, orders, properties);
  await createReviewReplies(prisma, users.tenant, reviews);
  printSummary({ properties, rooms, orders, reviews });
};

seedDatabase()
  .catch((error) => {
    logError('Seed gagal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
