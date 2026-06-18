import type { FC } from 'react';
import type { PropertyImage } from '@/types';
import { DesktopPropertyGallery, EmptyPropertyGallery, MobilePropertyGallery } from './PropertyGalleryParts';

interface PropertyGalleryProps {
  featuredImageUrl: string;
  images: PropertyImage[];
  name: string;
}

export const PropertyGallery: FC<PropertyGalleryProps> = ({ featuredImageUrl, images, name }) => {
  const allImages = getGalleryImages(featuredImageUrl, images);
  const displayImages = allImages.slice(0, 5);
  if (!displayImages.length) return <EmptyPropertyGallery />;
  return (
    <div className="mt-4 overflow-hidden rounded-3xl">
      <MobilePropertyGallery images={displayImages} name={name} />
      <DesktopPropertyGallery allImages={allImages} images={displayImages} name={name} />
    </div>
  );
};

const getGalleryImages = (featuredImageUrl: string, images: PropertyImage[]) => {
  const gallery = images.map((image) => image.image_url);
  return featuredImageUrl ? [featuredImageUrl, ...gallery] : gallery;
};
