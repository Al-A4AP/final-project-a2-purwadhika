import type { FC } from "react";
import type { PropertyCategory } from "@/types";

export const PropertyCategoryBadge: FC<{ category?: PropertyCategory }> = ({ category }) => (
  category ? <div className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white">{category.name}</div> : null
);
