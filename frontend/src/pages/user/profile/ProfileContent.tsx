import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { useProfileActions } from "@/hooks/user/profile/useProfileActions";
import { AvatarUploadSection } from "./AvatarUploadSection";
import { EmailPanel } from "./EmailPanel";
import { PasswordPanel } from "./PasswordPanel";
import { ProfileInfoPanel } from "./ProfileInfoPanel";

type ProfileState = ReturnType<typeof useProfileActions>;

export const ProfileContent: FC<{ state: ProfileState }> = ({ state }) => {
  const isTenant = state.user?.role === "TENANT";
  const backUrl = isTenant ? "/tenant/dashboard" : "/";
  const backText = isTenant ? "Kembali ke Dashboard Tenant" : "Kembali ke Beranda";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
        <Link to={backUrl} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">{backText}</span>
          <span className="sm:hidden">Kembali</span>
        </Link>
      </div>
      <AvatarUploadSection state={state} />
    <ProfileInfoPanel state={state} />
    <EmailPanel state={state} />
    <PasswordPanel state={state} />
    </div>
  );
};
