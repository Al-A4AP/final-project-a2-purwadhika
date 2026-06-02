// Format currency to IDR
export const formatPrice = (price: number): string => {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatCurrency = (price: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export const formatDate = (date: Date | string): string => {
  const dateObj = parseDisplayDate(date);
  if (isNaN(dateObj.getTime())) return "";
  return formatUtcDateParts(dateObj);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = parseDisplayDate(date);
  if (isNaN(dateObj.getTime())) return "";
  return `${formatUtcDateParts(dateObj)} ${formatUtcTimeParts(dateObj)}`;
};

// Format date to YYYY-MM-DD for input[type=date]
// Input: Date object atau string YYYY-MM-DD
export const formatDateForInput = (date: Date | string): string => {
  if (typeof date === "string") {
    return date; // Already YYYY-MM-DD format
  }
  // Convert Date to UTC YYYY-MM-DD
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Parse date string (YYYY-MM-DD) to Date (UTC)
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-");
  return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
};

export const getDaysBetween = (
  startDate: Date | string,
  endDate: Date | string,
): number => {
  const start = toDate(startDate);
  const end = toDate(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Combine class names (Tailwind utility)
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};

const parseDisplayDate = (date: Date | string) => {
  if (date instanceof Date) return date;
  if (date.includes("T")) return new Date(date);
  return parseDate(date);
};

const toDate = (date: Date | string) =>
  date instanceof Date ? date : parseDate(date);

const formatUtcDateParts = (date: Date) => {
  const day = padDatePart(date.getUTCDate());
  const month = padDatePart(date.getUTCMonth() + 1);
  return `${day}-${month}-${date.getUTCFullYear()}`;
};

const formatUtcTimeParts = (date: Date) => {
  const hours = padDatePart(date.getUTCHours());
  const minutes = padDatePart(date.getUTCMinutes());
  return `${hours}:${minutes}`;
};

const padDatePart = (value: number) =>
  String(value).padStart(2, "0");
