import { useEffect, useState } from "react";
import { tenantService } from "@/services/tenantService";
import type { PropertyCategory } from "@/types";

export const usePropertyCategoryOptions = () => {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  useEffect(() => {
    tenantService.getCategories({ sortBy: "name", sortOrder: "asc", limit: 50 })
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);
  return categories;
};
