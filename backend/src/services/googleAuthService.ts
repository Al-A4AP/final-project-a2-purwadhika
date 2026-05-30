import { AppError } from '../middlewares/errorHandler';

type GoogleProfile = {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export const getGoogleProfile = async (accessToken: string) => {
  if (!accessToken) throw new AppError('Token Google wajib dikirim', 400);
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new AppError('Token Google tidak valid', 401);
  const profile = await response.json() as GoogleProfile;
  if (!profile.email || profile.email_verified === false) {
    throw new AppError('Email Google belum terverifikasi', 401);
  }
  return profile;
};
