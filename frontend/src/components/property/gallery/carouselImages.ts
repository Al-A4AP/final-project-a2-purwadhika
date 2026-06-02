import type { PropertyImage } from "@/types";

export interface CarouselImage {
  alt: string;
  src: string;
}

export const buildCarouselImages = (featuredImageUrl: string, name: string, images: PropertyImage[]) =>
  [buildFeaturedImage(featuredImageUrl, name), ...buildGalleryImages(images, name)].filter(hasImageSource);

const buildFeaturedImage = (src: string, name: string) => ({ alt: name, src });

const buildGalleryImages = (images: PropertyImage[] = [], name: string) =>
  images.map((image, index) => ({ alt: `${name} ${index + 1}`, src: image.image_url }));

const hasImageSource = (image: CarouselImage) => Boolean(image.src);
