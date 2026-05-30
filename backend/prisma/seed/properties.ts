import type { PrismaClient, Property } from '@prisma/client';
import { PROPERTY_SEEDS } from './data';
import type { UploadedImages } from './assets';
import type { CategoryMap } from './categories';
import { getPropertyAmenities } from './amenities';

type PropertySeed = (typeof PROPERTY_SEEDS)[number];

const mapImages = (keys: (keyof UploadedImages)[], images: UploadedImages) =>
  keys.map((key, order) => ({
    image_url: images[key].url,
    cloudinary_public_id: images[key].publicId,
    order,
  }));

const buildPropertyData = (
  { category, featured, images: imageKeys, ...property }: PropertySeed,
  tenantId: string,
  categories: CategoryMap,
  images: UploadedImages,
) => ({
  ...property,
  tenantId,
  categoryId: categories[category].id,
  featured_image_url: images[featured].url,
  amenities: getPropertyAmenities(property.name),
  images: { create: mapImages(imageKeys, images) },
});

const createProperty = (
  prisma: PrismaClient,
  tenantId: string,
  categories: CategoryMap,
  images: UploadedImages,
  seed: PropertySeed,
) => prisma.property.create({ data: buildPropertyData(seed, tenantId, categories, images) });

export const createProperties = async (
  prisma: PrismaClient,
  tenantId: string,
  categories: CategoryMap,
  images: UploadedImages,
): Promise<Property[]> =>
  Promise.all(PROPERTY_SEEDS.map((seed) => createProperty(prisma, tenantId, categories, images, seed)));
