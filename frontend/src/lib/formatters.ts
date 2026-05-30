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

// Format date to "DD-MM-YYYY" (e.g., 18-05-2026)
// Input: string format YYYY-MM-DD (UTC) atau Date object
export const formatDate = (date: Date | string): string => {
  let dateObj: Date;

  if (typeof date === "string") {
    // Parse YYYY-MM-DD as UTC, not local
    const [year, month, day] = date.split("-");
    if (!year || !month || !day) return "";
    dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
    );
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return "";

  // Get UTC values, not local
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

// Format datetime to "DD-MM-YYYY HH:mm" (e.g., 18-05-2026 14:30)
// Input: string format YYYY-MM-DD atau ISO datetime (UTC)
export const formatDateTime = (date: Date | string): string => {
  let dateObj: Date;

  if (typeof date === "string") {
    // Handle YYYY-MM-DD or ISO format
    if (date.includes("T")) {
      dateObj = new Date(date); // ISO format, already UTC
    } else {
      // YYYY-MM-DD format, parse as UTC
      const [year, month, day] = date.split("-");
      if (!year || !month || !day) return "";
      dateObj = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
      );
    }
  } else {
    dateObj = date;
  }

  if (isNaN(dateObj.getTime())) return "";

  // Get UTC values
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
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

// Calculate days between two dates (both UTC)
// Input: YYYY-MM-DD strings atau Date objects
export const getDaysBetween = (
  startDate: Date | string,
  endDate: Date | string,
): number => {
  let start: Date;
  let end: Date;

  if (typeof startDate === "string") {
    start = parseDate(startDate);
  } else {
    start = startDate;
  }

  if (typeof endDate === "string") {
    end = parseDate(endDate);
  } else {
    end = endDate;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Combine class names (Tailwind utility)
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
