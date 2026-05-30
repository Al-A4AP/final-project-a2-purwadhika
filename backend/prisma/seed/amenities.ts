const AMENITIES_BY_PROPERTY: Record<string, string[]> = {
  'Grand Menteng Hotel': ['wifi', 'breakfast', 'pool', 'parking', 'gym'],
  'Hotel Malioboro Indah': ['wifi', 'breakfast', 'parking', 'workspace'],
  'Skyline Apartemen Sudirman': ['wifi', 'parking', 'gym', 'kitchen', 'workspace'],
  'Apartemen Surabaya Center': ['wifi', 'parking', 'kitchen', 'tv'],
  'Villa Ubud Hijau': ['wifi', 'pool', 'kitchen', 'parking', 'breakfast'],
  'Rumah Tepi Pantai Lombok': ['wifi', 'kitchen', 'parking', 'tv'],
  'Kost Premium Bandung': ['wifi', 'workspace', 'parking', 'tv'],
  'Kost Eksklusif Semarang': ['wifi', 'workspace', 'parking'],
};

export const getPropertyAmenities = (name: string) =>
  AMENITIES_BY_PROPERTY[name] || ['wifi'];
