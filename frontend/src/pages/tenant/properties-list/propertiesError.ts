import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import type { TenantProperty } from "@/types";

export const handlePropertiesError = (
  err: unknown,
  setError: (message: string) => void,
  setProperties: (properties: TenantProperty[]) => void,
) => {
  const message = getApiErrorMessage(err, "Properti belum bisa dimuat. Periksa koneksi lalu coba lagi.");
  setError(message);
  setProperties([]);
  toast.error(message);
};
