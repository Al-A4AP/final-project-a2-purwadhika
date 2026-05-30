import { v2 as cloudinary } from 'cloudinary';
import { IMAGE_URLS, type ImageKey } from './data';

export type UploadedImage = {
  url: string;
  publicId: string;
};

export type UploadedImages = Record<ImageKey, UploadedImage>;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (url: string): Promise<UploadedImage> => {
  try {
    const result = await cloudinary.uploader.upload(url, { folder: 'proprrent' });
    return { url: result.secure_url, publicId: result.public_id };
  } catch {
    return { url, publicId: '' };
  }
};

export const uploadSeedImages = async (): Promise<UploadedImages> => {
  const entries = await Promise.all(
    Object.entries(IMAGE_URLS).map(async ([key, url]) => [key, await uploadImage(url)]),
  );

  return Object.fromEntries(entries) as UploadedImages;
};
