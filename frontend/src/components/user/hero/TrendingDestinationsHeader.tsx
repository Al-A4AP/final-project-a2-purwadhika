import type { FC } from "react";

export const TrendingDestinationsHeader: FC = () => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="inline-block w-2.5 h-6 bg-red-600 rounded-full"></span>
        Destinasi Populer yang Sedang Tren
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Rekomendasi kota terbaik di Indonesia untuk liburan tak terlupakan Anda berikutnya
      </p>
    </div>
  </div>
);
