import type { FC } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight } from "lucide-react";

export const RefundNoticeContent: FC<{ count: number }> = ({ count }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 rounded-full bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
      <AlertCircle size={20} />
    </div>
    <div>
      <h3 className="font-bold text-orange-900 dark:text-orange-300">Refund Manual Sedang Diproses</h3>
      <p className="mt-1 text-sm text-orange-800 dark:text-orange-200/80">
        Ada {count} pesanan yang telah dibatalkan dan masih menunggu
        pengembalian dana dari pengelola properti.
      </p>
    </div>
  </div>
);

export const RefundNoticeLink: FC = () => (
  <Link
    to="/orders"
    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
  >
    Lihat Riwayat Reservasi <ChevronRight size={16} className="ml-1" />
  </Link>
);
