import type { FC } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { ORDER_STATUS_FILTER_OPTIONS } from "@/lib/constants";
import type { UserOrderFilterActions, UserOrderFilters } from "./userOrdersTypes";

interface UserOrdersFilterProps {
  actions: UserOrderFilterActions;
  filters: UserOrderFilters;
  onSearch: () => void;
}

const INPUT_CLASS = "w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium";

export const UserOrdersFilter: FC<UserOrdersFilterProps> = ({ actions, filters, onSearch }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={filters.orderNumber} 
            onChange={(e) => actions.setOrderNumber(e.target.value)} 
            placeholder="Cari No. Reservasi" 
            className={INPUT_CLASS} 
          />
        </div>
        
        {/* Status Select */}
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={filters.status} 
            onChange={(e) => actions.setStatus(e.target.value)} 
            className={`${INPUT_CLASS} appearance-none cursor-pointer`}
          >
            {ORDER_STATUS_FILTER_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Date Start */}
        <div className="relative">
          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <CustomDatePickerPopup 
            value={filters.startDate} 
            onChange={actions.setStartDate} 
            className={`${INPUT_CLASS} pl-10! cursor-pointer`} 
            placeholder="Tgl Mulai" 
          />
        </div>

        {/* Date End */}
        <div className="relative">
          <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
          <CustomDatePickerPopup 
            value={filters.endDate} 
            onChange={actions.setEndDate} 
            className={`${INPUT_CLASS} pl-10! cursor-pointer`} 
            placeholder="Tgl Selesai" 
          />
        </div>
      </div>
      
      <button 
        onClick={onSearch} 
        className="shrink-0 bg-red-600 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-sm transition hover:bg-red-700 hover:shadow-md h-full md:h-auto"
      >
        Terapkan Filter
      </button>
    </div>
  );
};
