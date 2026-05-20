import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { Property } from '@/types';
import { formatPrice } from '@/lib/formatters';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: FC<PropertyCardProps> = ({ property }) => {
  const image = property.featured_image_url || 'https://via.placeholder.com/300x200?text=Property';

  return (
    <Link
      to={`/properties/${property.id}`}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
        <img
          src={image}
          alt={property.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {property.category && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin size={16} className="mr-1" />
          {property.city}
        </div>

        {/* Rating */}
        {property.rating !== undefined && (
          <div className="flex items-center text-sm mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(property.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              ({property.review_count || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
          <div className="text-2xl font-bold text-red-600">
            {property.min_price === 0 ? (
              <span className="text-green-600 dark:text-green-400">Gratis</span>
            ) : (
              formatPrice(property.min_price)
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">per malam</p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
