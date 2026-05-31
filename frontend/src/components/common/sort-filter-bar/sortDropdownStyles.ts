const ACTIVE_BUTTON_CLASS = "bg-rose-600 text-white border-rose-600 shadow-sm";
const OPEN_BUTTON_CLASS = "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600";
const IDLE_BUTTON_CLASS = "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:border-rose-450 hover:text-rose-600";

export const getDropdownButtonClass = (active: boolean, open: boolean) => {
  const tone = active ? ACTIVE_BUTTON_CLASS : open ? OPEN_BUTTON_CLASS : IDLE_BUTTON_CLASS;
  return `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition border ${tone}`;
};

export const getDropdownOptionClass = (active: boolean) => {
  const tone = active
    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800";
  return `w-full text-left px-5 py-2.5 text-xs font-semibold transition ${tone}`;
};
