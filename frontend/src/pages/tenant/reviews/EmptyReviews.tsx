import type { FC } from "react";
import { EmptyState } from "@/components/common/EmptyState";

export const EmptyReviews: FC = () => (
  <EmptyState title="Belum ada ulasan yang masuk" description="Ulasan tamu dari properti Anda akan tampil di sini." />
);
