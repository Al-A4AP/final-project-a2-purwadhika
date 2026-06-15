import type { FC } from "react";
import { useState } from "react";
import { Pencil, Send, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { formatVoucherBenefit } from "@/lib/voucherFormatters";
import type { Voucher } from "@/types";
import type { useTenantVouchersPage } from "@/hooks/tenant/vouchers/useTenantVouchersPage";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AssignVoucherModal } from "./AssignVoucherModal";
import { Pagination } from "@/components/common/Pagination";

type State = ReturnType<typeof useTenantVouchersPage>;

export const TenantVoucherList: FC<{ state: State }> = ({ state }) => {
  const [deletingVoucher, setDeletingVoucher] = useState<Voucher | null>(null);

  if (!state.vouchers.length) return <EmptyVoucherList />;
  return (
    <div className="space-y-4">
      {state.vouchers.map((voucher) => (
        <VoucherCard 
          key={voucher.id} 
          voucher={voucher} 
          onDelete={() => setDeletingVoucher(voucher)} 
          onEdit={state.setEditing} 
          onAssign={state.setAssigning}
          isActive={state.editing?.id === voucher.id}
        />
      ))}
      <ConfirmModal
        isOpen={!!deletingVoucher}
        title="Hapus Voucher"
        message={`Apakah Anda yakin ingin menghapus voucher ${deletingVoucher?.code}?`}
        onCancel={() => setDeletingVoucher(null)}
        onConfirm={async () => {
          if (deletingVoucher) {
            await state.deleteVoucher(deletingVoucher);
            setDeletingVoucher(null);
          }
        }}
      />
      <AssignVoucherModal
        voucher={state.assigning}
        saving={state.saving}
        onClose={() => state.setAssigning(null)}
        onSubmit={async (email) => {
          if (state.assigning) {
            await state.assignVoucher(state.assigning, email);
          }
        }}
      />
      {state.totalPages > 1 && (
        <Pagination
          currentPage={state.page}
          totalPages={state.totalPages}
          onPageChange={state.setPage}
        />
      )}
    </div>
  );
};

const EmptyVoucherList: FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Belum ada voucher" description="Tambahkan voucher pertama untuk mulai memberi promo kepada pelanggan." />
  </div>
);

const VoucherCard: FC<{ onDelete: () => void; onEdit: (voucher: Voucher) => void; onAssign: (voucher: Voucher) => void; voucher: Voucher; isActive?: boolean }> = ({ onDelete, onEdit, onAssign, voucher, isActive }) => (
  <div className={`rounded-2xl border p-5 shadow-sm transition-colors ${isActive ? 'border-amber-400 bg-amber-50/20 dark:border-amber-500/50 dark:bg-slate-800' : 'border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <VoucherInfo voucher={voucher} />
      <VoucherActions voucher={voucher} onDelete={onDelete} onEdit={onEdit} onAssign={onAssign} />
    </div>
    <VoucherMeta voucher={voucher} />
  </div>
);

const VoucherInfo: FC<{ voucher: Voucher }> = ({ voucher }) => (
  <div>
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{voucher.code}</span>
      <span className={voucher.is_active ? activeClass : inactiveClass}>{voucher.is_active ? "Aktif" : "Nonaktif"}</span>
    </div>
    {voucher.name && voucher.name !== voucher.code && <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">{voucher.name}</h2>}
    {voucher.description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{voucher.description}</p>}
  </div>
);

const VoucherMeta: FC<{ voucher: Voucher }> = ({ voucher }) => (
  <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
    <span>Manfaat: <strong>{formatVoucherBenefit(voucher)}</strong></span>
    <span>Kuota: <strong>{voucher.quota ? `${voucher.used_count}/${voucher.quota}` : `${voucher.used_count} terpakai`}</strong></span>
    <span>Berakhir: <strong>{new Date(voucher.expires_at).toLocaleDateString("id-ID")}</strong></span>
  </div>
);

const VoucherActions: FC<{ onDelete: () => void; onEdit: (voucher: Voucher) => void; onAssign: (voucher: Voucher) => void; voucher: Voucher }> = ({ onDelete, onEdit, onAssign, voucher }) => (
  <div className="flex gap-2">
    <button type="button" onClick={() => onAssign(voucher)} className={actionButtonClass} title="Kirim ke pelanggan" aria-label="Kirim ke pelanggan"><Send size={16} /></button>
    <button type="button" onClick={() => onEdit(voucher)} className={actionButtonClass} title="Edit voucher" aria-label="Edit voucher"><Pencil size={16} /></button>
    <button type="button" onClick={onDelete} className={dangerButtonClass} title="Hapus voucher" aria-label="Hapus voucher"><Trash2 size={16} /></button>
  </div>
);

const activeClass = "rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
const inactiveClass = "rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300";
const actionButtonClass = "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700";
const dangerButtonClass = "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:border-slate-700";
