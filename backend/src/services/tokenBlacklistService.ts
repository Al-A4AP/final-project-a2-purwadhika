import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { isAuthJwtPayload } from '../types/authJwt';
import prisma from '../config/prisma';

const DEFAULT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const getFallbackExpiry = () => Date.now() + DEFAULT_EXPIRY_MS;

const getDecodedExpiry = (token: string) => {
  const decoded = jwt.decode(token);
  return isAuthJwtPayload(decoded) && decoded.exp
    ? decoded.exp * 1000
    : getFallbackExpiry();
};

const getTokenExpiry = (token: string): number => {
  try {
    return getDecodedExpiry(token);
  } catch {
    return getFallbackExpiry();
  }
};

const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const revokeToken = async (token: string): Promise<void> => {
  const token_hash = hashToken(token);
  const expires_at = new Date(getTokenExpiry(token));
  
  try {
    await prisma.revokedToken.create({
      data: { token_hash, expires_at }
    });
  } catch (error) {
    // Abaikan jika token sudah ada di blacklist (unique constraint)
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const token_hash = hashToken(token);
  const record = await prisma.revokedToken.findUnique({
    where: { token_hash },
    select: { id: true }
  });
  return !!record;
};
