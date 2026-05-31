import type { FC } from "react";

export const RecentOrdersEmpty: FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center md:p-12">
    <p className="text-sm text-gray-500">Belum ada pesanan terbaru bulan ini.</p>
  </div>
);
