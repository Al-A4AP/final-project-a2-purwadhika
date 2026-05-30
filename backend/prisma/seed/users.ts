import type { PrismaClient, User } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { DEFAULT_PASSWORD, USER_SEEDS } from './data';

export type SeedUsers = Record<(typeof USER_SEEDS)[number]['key'], User>;

export const createUsers = async (prisma: PrismaClient): Promise<SeedUsers> => {
  const passwordHash = await bcryptjs.hash(DEFAULT_PASSWORD, 10);
  const verifiedAt = new Date();
  const users = await Promise.all(
    USER_SEEDS.map(({ key: _key, ...user }) =>
      prisma.user.create({ data: { ...user, password_hash: passwordHash, verified_at: verifiedAt } }),
    ),
  );

  return Object.fromEntries(users.map((user, index) => [USER_SEEDS[index].key, user])) as SeedUsers;
};
