import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@/types";
import { profileSchema, type ProfileInput } from "@/validations/profile";
import { compactProfileData } from "./profileFormData";

export const useProfileInfoForm = (user: User | null, onSave: (data: ProfileInput) => Promise<void>) => {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      domicile_address: user?.domicile_address || "",
      ktp_address: user?.ktp_address || "",
      legal_name: user?.legal_name || "",
      name: user?.name || "",
      phone: user?.phone || "",
    },
  });
  const submit = (data: ProfileInput) => onSave(compactProfileData(data));
  return { form, submit };
};
