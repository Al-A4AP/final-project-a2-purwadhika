export const escapeHtml = (unsafe: unknown): string => {
  if (typeof unsafe !== "string") return String(unsafe);
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const buildCenteredLink = (url: string, label: string) =>
  `<p style="text-align: center;"><a href="${url}" class="btn" style="color: #ffffff;">${label}</a></p>`;

export const buildCopyLinkInfo = (url: string) => `
    <p>Atau salin tautan berikut ke browser Anda jika tombol di atas tidak berfungsi:</p>
    <p style="word-break: break-all; font-size: 13px; color: #64748b;">${url}</p>`;

export const formatEmailPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export const formatEmailDate = (date: Date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
