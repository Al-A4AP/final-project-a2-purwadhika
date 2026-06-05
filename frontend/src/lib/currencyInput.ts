export const getCurrencyDigits = (value: string) =>
  value.replace(/\D/g, "");

export const formatCurrencyInputValue = (value: number | string | null | undefined) => {
  const digits = getCurrencyDigits(String(value ?? ""));
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
};

export const readCurrencyInputValue = (value: string) =>
  getCurrencyDigits(value);
