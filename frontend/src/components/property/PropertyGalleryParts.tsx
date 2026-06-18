import type { FC } from "react";
import { ImageOff } from "lucide-react";

export const EmptyPropertyGallery = () => (
  <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 sm:h-96">
    <ImageOff size={48} className="mb-2" /><span className="text-sm font-medium">Gambar tidak tersedia</span>
  </div>
);

export const MobilePropertyGallery: FC<{ images: string[]; name: string }> = ({ images, name }) => (
  <div className="relative h-64 w-full sm:hidden">
    <img src={images[0]} alt={name} className="h-full w-full object-cover" />
    {images.length > 1 && <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">1 / {images.length}</div>}
  </div>
);

export const DesktopPropertyGallery: FC<{ allImages: string[]; images: string[]; name: string }> = ({ allImages, images, name }) => (
  <div className="hidden h-100 gap-2 sm:grid sm:grid-cols-4 md:h-120">
    <GalleryMainImage image={images[0]} imageCount={images.length} name={name} />
    {images.slice(1, 5).map((image, index) => <GalleryThumbnail allCount={allImages.length} image={image} imageCount={images.length} index={index} key={`${image}-${index}`} name={name} />)}
  </div>
);

const GalleryMainImage: FC<{ image: string; imageCount: number; name: string }> = ({ image, imageCount, name }) => (
  <div className={`relative h-full ${mainImageClass(imageCount)}`}><img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>
);

const GalleryThumbnail: FC<{ allCount: number; image: string; imageCount: number; index: number; name: string }> = (props) => (
  <div className={`relative h-full overflow-hidden ${props.imageCount === 2 ? "col-span-2" : "col-span-1"}`}>
    <img src={props.image} alt={`${props.name} ${props.index + 2}`} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
    {props.index === 3 && props.allCount > 5 && <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-xl font-bold text-white backdrop-blur-sm transition hover:bg-black/40">+{props.allCount - 5}</div>}
  </div>
);

const mainImageClass = (count: number) =>
  count === 1 ? "col-span-4" : count === 2 ? "col-span-2" : "col-span-2 row-span-2";
