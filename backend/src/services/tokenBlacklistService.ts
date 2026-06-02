import jwt from 'jsonwebtoken';
import { isAuthJwtPayload } from '../types/authJwt';

const tokenBlacklist = new Set<string>();
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

export const revokeToken = (token: string): void => {
  tokenBlacklist.add(token);
  const expiryTime = getTokenExpiry(token) - Date.now();
  setTimeout(() => tokenBlacklist.delete(token), Math.max(expiryTime, 0));
};

export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};

export const clearBlacklist = (): void => {
  tokenBlacklist.clear();
};
