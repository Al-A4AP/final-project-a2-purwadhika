import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { voucherService } from "@/services/voucherService";
import type { Voucher, VoucherFormInput } from "@/types";

export const useTenantVouchersPage = () => {
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [assigning, setAssigning] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  
  const load = useCallback(() => loadVouchers(page, limit, setLoading, setVouchers, setTotalPages), [page]);
  useEffect(() => { Promise.resolve().then(load); }, [load]);
  const saveVoucher = (data: VoucherFormInput) => saveVoucherData(data, editing, setSaving, setEditing, load);
  const deleteVoucher = (voucher: Voucher) => deleteVoucherData(voucher, load);
  const assignVoucher = async (voucher: Voucher, email: string) => {
    setSaving(true);
    try {
      await voucherService.assignVoucher(voucher.id, email);
      toast.success("Voucher berhasil dikirim ke " + email);
      setAssigning(null);
    } catch (err) { toast.error(getApiErrorMessage(err, "Gagal mengirim voucher.")); }
    finally { setSaving(false); }
  };
  return { assignVoucher, assigning, setAssigning, deleteVoucher, editing, load, loading, saveVoucher, saving, setEditing, vouchers, page, setPage, totalPages };
};

const loadVouchers = async (page: number, limit: number, setLoading: SetBoolean, setVouchers: SetVouchers, setTotalPages: (n: number) => void) => {
  setLoading(true);
  try { 
    const res = await voucherService.getTenantVouchers(page, limit);
    setVouchers(res.data);
    setTotalPages(res.meta.totalPages);
  }
  catch (err) { toast.error(getApiErrorMessage(err, "Voucher belum bisa dimuat.")); }
  finally { setLoading(false); }
};

const saveVoucherData = async (data: VoucherFormInput, editing: Voucher | null, setSaving: SetBoolean, setEditing: SetEditing, load: () => void) => {
  setSaving(true);
  try {
    if (editing) await voucherService.updateTenantVoucher(editing.id, data);
    else await voucherService.createTenantVoucher(data);
    toast.success(editing ? "Voucher diperbarui" : "Voucher dibuat");
    setEditing(null);
    load();
  } catch (err) { toast.error(getApiErrorMessage(err, "Voucher gagal disimpan.")); }
  finally { setSaving(false); }
};

const deleteVoucherData = async (voucher: Voucher, load: () => void) => {
  try { await voucherService.deleteTenantVoucher(voucher.id); toast.success("Voucher dihapus"); load(); }
  catch (err) { toast.error(getApiErrorMessage(err, "Voucher gagal dihapus.")); }
};

type SetBoolean = (value: boolean) => void;
type SetEditing = (voucher: Voucher | null) => void;
type SetVouchers = (vouchers: Voucher[]) => void;
