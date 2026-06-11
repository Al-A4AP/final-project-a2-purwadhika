import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { User } from "@/types";
import type { ProfileInput } from "@/validations/profile";
import { ProfileTextField } from "./ProfileTextField";

interface Props {
  form: UseFormReturn<ProfileInput>;
  inputClass: string;
  user: User | null;
}

export const ProfileInfoFields: FC<Props> = ({ form, inputClass, user }) => {
  if (user?.role === "TENANT") {
    return <TenantFields form={form} inputClass={inputClass} user={user} />;
  }
  return <CustomerFields form={form} inputClass={inputClass} user={user} />;
};

const CustomerFields: FC<Props> = ({ form, inputClass, user }) => (
  <>
    <ProfileTextField label="Nama Lengkap" inputClass={inputClass} placeholder={user?.name || "Nama Lengkap"} registration={form.register("name")} error={form.formState.errors.name?.message} />
    <ProfileTextField label="Nomor KTP" inputClass={inputClass} placeholder="16 Digit KTP" inputMode="numeric" maxLength={16} registration={form.register("ktp_number")} error={form.formState.errors.ktp_number?.message} />
    <ProfileTextField label="Nama sesuai KTP" inputClass={inputClass} placeholder="Nama legal sesuai dokumen" registration={form.register("legal_name")} error={form.formState.errors.legal_name?.message} />
    <ProfileTextField label="Alamat sesuai KTP" inputClass={inputClass} placeholder="Alamat pada KTP" registration={form.register("ktp_address")} error={form.formState.errors.ktp_address?.message} />
    <ProfileTextField label="Nomor Telepon" inputClass={inputClass} placeholder="+62812xxxxxxxx" inputMode="tel" registration={form.register("phone")} error={form.formState.errors.phone?.message} />
  </>
);

const TenantFields: FC<Props> = ({ form, inputClass, user }) => (
  <>
    <ProfileTextField label="Nama Lengkap (User Name)" inputClass={inputClass} placeholder={user?.name || "Nama Lengkap"} registration={form.register("name")} error={form.formState.errors.name?.message} />
    <ProfileTextField label="Nomor Telepon" inputClass={inputClass} placeholder="+62812xxxxxxxx" inputMode="tel" registration={form.register("phone")} error={form.formState.errors.phone?.message} />
    <ProfileTextField label="Alamat Operasional" inputClass={inputClass} placeholder="Alamat lengkap" registration={form.register("ktp_address")} error={form.formState.errors.ktp_address?.message} />
  </>
);
