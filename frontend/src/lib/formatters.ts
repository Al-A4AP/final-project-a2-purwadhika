// Format currency to IDR
export const formatPrice = (price: number): string => {
  if (price === 0) return 'Gratis';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

// Format date to "DD-MM-YYYY" (e.g., 18-05-2026)
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

// Format datetime to "DD-MM-YYYY HH:mm" (e.g., 18-05-2026 14:30)
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

// Format date to YYYY-MM-DD for input[type=date]
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

// Parse date string (YYYY-MM-DD) to Date
export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

// Calculate days between two dates
export const getDaysBetween = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Combine class names (Tailwind utility)
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
