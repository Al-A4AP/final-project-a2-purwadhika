import type { PrismaClient } from '@prisma/client';

export const clearDatabase = async (prisma: PrismaClient) => {
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
};
