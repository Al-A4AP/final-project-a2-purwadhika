import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types';
import { PropertyCardBody } from './property-card/PropertyCardBody';
import { PropertyImage } from './property-card/PropertyImage';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: FC<PropertyCardProps> = ({ property }) => (
  <Link to={`/properties/${property.id}`} className="overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 hover:shadow-xl dark:bg-slate-800">
    <PropertyImage property={property} />
    <PropertyCardBody property={property} />
  </Link>
);

export default PropertyCard;
