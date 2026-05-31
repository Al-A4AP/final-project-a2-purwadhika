import type { FC } from "react";

export const OrdersEmptyRow: FC = () => (
  <tr>
    <td colSpan={6} className="px-6 py-8 text-center">
      Belum ada pesanan masuk.
    </td>
  </tr>
);
