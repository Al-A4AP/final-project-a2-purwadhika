import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { getGoogleProfile } from './googleAuthService';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload: object) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as any);

const sanitizeUser = (user: any) => {
  const { password_hash, ...safe } = user;
  return safe;
};

const createGoogleUser = async (profile: any, role: Role) => {
  const dummyPassword = crypto.randomBytes(16).toString('hex');
  const password_hash = await bcryptjs.hash(dummyPassword, 10);
  return prisma.user.create({
    data: {
      email: profile.email!,
      name: profile.name || profile.email!,
      password_hash,
      role,
      auth_provider: 'GOOGLE',
      verified_at: new Date(),
      avatar_url: profile.picture,
    },
  });
};

const verifyExistingGoogleUser = async (user: any, requestedRole?: Role) => {
  if (requestedRole && user.role !== requestedRole) throw new AppError('Email Google sudah terdaftar dengan role berbeda', 409);
  if (user.verified_at) return user;
  return prisma.user.update({ where: { id: user.id }, data: { verified_at: new Date() } });
};

export const googleLogin = async (data: { accessToken: string; role?: Role }) => {
  const profile = await getGoogleProfile(data.accessToken);
  const existing = await prisma.user.findFirst({ where: { email: profile.email!, deleted_at: null } });
  const user = existing
    ? await verifyExistingGoogleUser(existing, data.role)
    : await createGoogleUser(profile, data.role || 'USER');
  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), token };
};
