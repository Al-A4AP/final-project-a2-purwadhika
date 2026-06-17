import type { FC } from "react";
import { operations } from "./TenantOperationsGridData";
import { TenantOperationCard } from "./TenantOperationsGridParts";

export const TenantOperationsGrid: FC = () => (
  <div className="mb-8">
    <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
      Pintasan Operasional
    </h2>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {operations.map((item) => (
        <TenantOperationCard key={item.href + item.title} operation={item} />
      ))}
    </div>
  </div>
);
