import { useForm } from "react-hook-form";
import type { User } from "@/types";
import { type ProfileInput } from "@/validations/profile";
import { compactProfileData } from "./profileFormData";
import { profileFormResolver } from "./profileFormResolver";

export const useProfileInfoForm = (user: User | null, onSave: (data: ProfileInput) => Promise<void>) => {
  const form = useForm<ProfileInput>({
    resolver: profileFormResolver,
    defaultValues: {
      ktp_number: user?.ktp_number || "",
      ktp_address: user?.ktp_address || "",
      legal_name: user?.legal_name || "",
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });
  const submit = (data: ProfileInput) => onSave(compactProfileData(data));
  return { form, submit };
};
