import type { FC } from "react";
import type { PropertyCategory } from "@/types";

export const PropertyCategoryBadge: FC<{ category?: PropertyCategory }> = ({ category }) => (
  category ? <div className="absolute left-3 top-3 z-10 max-w-[70%] truncate rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-sm">{category.name}</div> : null
);
