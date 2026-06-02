import type { FC } from "react";
import type { PropertyImage } from "@/types";
import { PropertyImageCarousel } from "./gallery/PropertyImageCarousel";

interface PropertyGalleryProps {
  featuredImageUrl: string;
  images: PropertyImage[];
  name: string;
}

export const PropertyGallery: FC<PropertyGalleryProps> = (props) => (
  <PropertyImageCarousel featuredImageUrl={props.featuredImageUrl} name={props.name} images={props.images} />
);
