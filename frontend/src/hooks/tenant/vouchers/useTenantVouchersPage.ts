import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { voucherService } from "@/services/voucherService";
import type { Voucher, VoucherFormInput } from "@/types";

export const useTenantVouchersPage = () => {
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const load = () => loadVouchers(setLoading, setVouchers);
  useEffect(() => { Promise.resolve().then(load); }, []);
  const saveVoucher = (data: VoucherFormInput) => saveVoucherData(data, editing, setSaving, setEditing, load);
  const deleteVoucher = (voucher: Voucher) => deleteVoucherData(voucher, load);
  return { deleteVoucher, editing, load, loading, saveVoucher, saving, setEditing, vouchers };
};

const loadVouchers = async (setLoading: SetBoolean, setVouchers: SetVouchers) => {
  setLoading(true);
  try { setVouchers(await voucherService.getTenantVouchers()); }
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
  if (!confirm(`Hapus voucher ${voucher.code}?`)) return;
  try { await voucherService.deleteTenantVoucher(voucher.id); toast.success("Voucher dihapus"); load(); }
  catch (err) { toast.error(getApiErrorMessage(err, "Voucher gagal dihapus.")); }
};

type SetBoolean = (value: boolean) => void;
type SetEditing = (voucher: Voucher | null) => void;
type SetVouchers = (vouchers: Voucher[]) => void;
