import { useEffect, useState } from 'react';

const getPageLimit = () => {
  if (typeof window === 'undefined') return 8;
  if (window.innerWidth < 768) return 2;
  if (window.innerWidth < 1024) return 4;
  return 8;
};

export const usePropertyPageLimit = () => {
  const [limit, setLimit] = useState(getPageLimit);

  useEffect(() => {
    const updateLimit = () => setLimit(getPageLimit());
    window.addEventListener('resize', updateLimit);
    return () => window.removeEventListener('resize', updateLimit);
  }, []);

  return limit;
};
