import jwt from 'jsonwebtoken';

const tokenBlacklist = new Set<string>();

const getTokenExpiry = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
  } catch {
    return Date.now() + 7 * 24 * 60 * 60 * 1000;
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
