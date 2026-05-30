import type { FC } from 'react';
import type { PropertyImage } from '@/types';

interface PropertyGalleryProps {
  featuredImageUrl: string;
  name: string;
  images: PropertyImage[];
}

export const PropertyGallery: FC<PropertyGalleryProps> = ({ featuredImageUrl, name, images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <img src={featuredImageUrl || ''} alt={name} className="w-full h-80 object-cover rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        {images?.slice(0, 4).map((img, i) => (
          <img key={i} src={img.image_url} alt="" className="w-full h-38 object-cover rounded-xl" />
        ))}
      </div>
    </div>
  );
};
