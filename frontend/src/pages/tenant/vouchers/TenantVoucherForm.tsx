import type { FC, FormEvent } from "react";
import { useState } from "react";
import type { Voucher, VoucherFormInput } from "@/types";
import type { useTenantVouchersPage } from "@/hooks/tenant/vouchers/useTenantVouchersPage";

type State = ReturnType<typeof useTenantVouchersPage>;

export const TenantVoucherForm: FC<{ state: State }> = ({ state }) => {
  const initialForm = state.editing ? voucherToForm(state.editing) : defaultVoucherForm();
  return <TenantVoucherFormFields key={state.editing?.id || "new"} initialForm={initialForm} state={state} />;
};

const TenantVoucherFormFields: FC<{ initialForm: VoucherFormInput; state: State }> = ({ initialForm, state }) => {
  const [form, setForm] = useState(initialForm);
  const submit = (event: FormEvent) => { event.preventDefault(); state.saveVoucher(normalizeForm(form)); };
  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{state.editing ? "Edit Voucher" : "Tambah Voucher"}</h2>
      <VoucherFormBody form={form} setForm={setForm} />
      <VoucherFormActions editing={Boolean(state.editing)} saving={state.saving} onCancel={() => state.setEditing(null)} />
    </form>
  );
};

const VoucherFormBody: FC<FormPartProps> = ({ form, setForm }) => (
  <>
    <VoucherTextField label="Kode" value={form.code} onChange={(value) => setForm({ ...form, code: value })} />
    <VoucherTextField label="Nama" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
    <VoucherTextField label="Deskripsi" value={form.description || ""} onChange={(value) => setForm({ ...form, description: value })} />
    <VoucherDiscountFields form={form} setForm={setForm} />
    <VoucherDateFields form={form} setForm={setForm} />
    <VoucherToggleFields form={form} setForm={setForm} />
  </>
);

const VoucherTextField: FC<{ label: string; onChange: (value: string) => void; value: string }> = ({ label, onChange, value }) => (
  <label className="block space-y-1.5">
    <span className={labelClass}>{label}</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} required={label !== "Deskripsi"} className={inputClass} />
  </label>
);

const VoucherDiscountFields: FC<FormPartProps> = ({ form, setForm }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    <label className="space-y-1.5"><span className={labelClass}>Tipe</span><select value={form.discount_type} onChange={(event) => setForm({ ...form, discount_type: event.target.value as VoucherFormInput["discount_type"] })} className={inputClass}><option value="PERCENTAGE">Persentase</option><option value="NOMINAL">Nominal</option></select></label>
    <label className="space-y-1.5"><span className={labelClass}>Nilai</span><input type="number" min={1} value={form.discount_value} onChange={(event) => setForm({ ...form, discount_value: Number(event.target.value) })} className={inputClass} /></label>
    <label className="space-y-1.5"><span className={labelClass}>Maks. Diskon</span><input type="number" min={0} value={form.max_discount || ""} onChange={(event) => setForm({ ...form, max_discount: numberOrNull(event.target.value) })} className={inputClass} /></label>
    <label className="space-y-1.5"><span className={labelClass}>Kuota</span><input type="number" min={0} value={form.quota || ""} onChange={(event) => setForm({ ...form, quota: numberOrNull(event.target.value) })} className={inputClass} /></label>
  </div>
);

const VoucherDateFields: FC<FormPartProps> = ({ form, setForm }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    <label className="space-y-1.5"><span className={labelClass}>Mulai</span><input type="datetime-local" value={form.starts_at} onChange={(event) => setForm({ ...form, starts_at: event.target.value })} className={inputClass} /></label>
    <label className="space-y-1.5"><span className={labelClass}>Berakhir</span><input type="datetime-local" value={form.expires_at} onChange={(event) => setForm({ ...form, expires_at: event.target.value })} className={inputClass} /></label>
  </div>
);

const VoucherToggleFields: FC<FormPartProps> = ({ form, setForm }) => (
  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
    <label className="flex gap-2"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Aktif</label>
    <label className="flex gap-2"><input type="checkbox" checked={form.new_user_only} onChange={(event) => setForm({ ...form, new_user_only: event.target.checked })} /> Promo pengguna baru</label>
  </div>
);

const VoucherFormActions: FC<{ editing: boolean; onCancel: () => void; saving: boolean }> = ({ editing, onCancel, saving }) => (
  <div className="flex gap-3">
    {editing && <button type="button" onClick={onCancel} className={secondaryButtonClass}>Batal</button>}
    <button type="submit" disabled={saving} className={primaryButtonClass}>{saving ? "Menyimpan..." : editing ? "Simpan" : "Tambah Voucher"}</button>
  </div>
);

const defaultVoucherForm = (): VoucherFormInput => ({ code: "", discount_type: "PERCENTAGE", discount_value: 5, expires_at: toDateTimeLocal(addDays(30)), is_active: true, name: "", new_user_only: false, starts_at: toDateTimeLocal(new Date()) });
const voucherToForm = (voucher: Voucher): VoucherFormInput => ({
  code: voucher.code,
  description: voucher.description || "",
  discount_type: voucher.discount_type,
  discount_value: voucher.discount_value,
  expires_at: toDateTimeLocal(new Date(voucher.expires_at)),
  is_active: voucher.is_active,
  max_discount: voucher.max_discount,
  name: voucher.name,
  new_user_only: voucher.new_user_only,
  quota: voucher.quota,
  starts_at: toDateTimeLocal(new Date(voucher.starts_at)),
});
const normalizeForm = (form: VoucherFormInput) => ({ ...form, code: form.code.toUpperCase(), expires_at: new Date(form.expires_at).toISOString(), starts_at: new Date(form.starts_at).toISOString() });
const numberOrNull = (value: string) => value ? Number(value) : null;
const addDays = (days: number) => new Date(Date.now() + days * 86400000);
const toDateTimeLocal = (date: Date) => date.toISOString().slice(0, 16);

const labelClass = "text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400";
const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white";
const primaryButtonClass = "flex-1 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-900";
const secondaryButtonClass = "rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200";

interface FormPartProps {
  form: VoucherFormInput;
  setForm: (form: VoucherFormInput) => void;
}
