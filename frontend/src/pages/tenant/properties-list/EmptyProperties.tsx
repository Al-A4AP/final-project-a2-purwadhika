import type { FC } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";

export const EmptyProperties: FC = () => (
  <EmptyState title="Tidak ada properti ditemukan" description="Tambahkan properti pertama atau ubah kata kunci pencarian." action={<Link to="/tenant/properties/new" className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">Tambah Properti Pertama</Link>} />
);
