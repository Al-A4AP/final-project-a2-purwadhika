import type { FC } from "react";
import { Link } from "react-router-dom";
import type { TenantOperationItem } from "./TenantOperationsGridData";

export const TenantOperationCard: FC<{ operation: TenantOperationItem }> = ({
  operation: item,
}) => (
  <Link
    to={item.href}
    className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
  >
    <OperationIcon item={item} />
    <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
    <p className="text-xs leading-tight text-slate-500 dark:text-slate-400">{item.desc}</p>
  </Link>
);

const OperationIcon: FC<{ item: TenantOperationItem }> = ({ item }) => (
  <div
    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110`}
  >
    <item.icon size={20} />
  </div>
);
