import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import type { AuthJwtPayload } from '../../types/authJwt';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES = env.JWT_EXPIRES_IN;
const ONE_HOUR = 60 * 60 * 1000;

export const generateToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as SignOptions['expiresIn'] });

export const createRawToken = () =>
  crypto.randomBytes(32).toString('hex');

export const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const oneHourFromNow = () =>
  new Date(Date.now() + ONE_HOUR);

export const createDummyPasswordHash = async () =>
  bcryptjs.hash(crypto.randomBytes(16).toString('hex'), 10);

type AuthTokenPayload = Pick<AuthJwtPayload, 'email' | 'id' | 'role'>;
