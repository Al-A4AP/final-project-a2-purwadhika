import type { FC } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { User } from "@/types";
import type { ProfileInput } from "@/validations/profile";
import { ProfileTextField } from "./ProfileTextField";

export const ProfileInfoFields: FC<{ form: UseFormReturn<ProfileInput>; inputClass: string; user: User | null }> = ({ form, inputClass, user }) => (
  <>
    <ProfileTextField label="Nama Lengkap" inputClass={inputClass} placeholder={user?.name} registration={form.register("name")} error={form.formState.errors.name?.message} />
    <ProfileTextField label="Nomor Telepon" inputClass={inputClass} placeholder="+62 812 xxxx xxxx" registration={form.register("phone")} />
  </>
);
