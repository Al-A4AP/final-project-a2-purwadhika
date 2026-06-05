import type { FC } from 'react';
import type { PropertyImage } from '@/types';
import { ImageOff } from 'lucide-react';

interface PropertyGalleryProps {
  featuredImageUrl: string;
  images: PropertyImage[];
  name: string;
}

export const PropertyGallery: FC<PropertyGalleryProps> = ({ featuredImageUrl, images, name }) => {
  const allImages = featuredImageUrl ? [featuredImageUrl, ...images.map((img) => img.image_url)] : images.map((img) => img.image_url);
  const displayImages = allImages.slice(0, 5); // Show max 5 images on desktop grid

  if (displayImages.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 sm:h-96">
        <ImageOff size={48} className="mb-2" />
        <span className="text-sm font-medium">Gambar tidak tersedia</span>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-3xl">
      {/* Mobile: Carousel or Single Image (Just single image + count for simple premium look on mobile for now) */}
      <div className="relative h-64 w-full sm:hidden">
        <img src={displayImages[0]} alt={name} className="h-full w-full object-cover" />
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            1 / {displayImages.length}
          </div>
        )}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden h-[400px] gap-2 sm:grid sm:grid-cols-4 md:h-[480px]">
        {/* Main large image */}
        <div className={`relative h-full ${displayImages.length === 1 ? 'col-span-4' : displayImages.length === 2 ? 'col-span-2' : 'col-span-2 row-span-2'}`}>
          <img src={displayImages[0]} alt={name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
        
        {/* Thumbnails */}
        {displayImages.slice(1, 5).map((img, i) => (
          <div key={i} className={`relative h-full overflow-hidden ${displayImages.length === 2 ? 'col-span-2' : 'col-span-1'}`}>
            <img src={img} alt={`${name} ${i + 2}`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            {i === 3 && allImages.length > 5 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-black/40 cursor-pointer">
                +{allImages.length - 5}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
