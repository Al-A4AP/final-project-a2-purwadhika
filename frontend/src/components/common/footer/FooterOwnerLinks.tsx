import type { FC } from "react";
import { Link } from "react-router-dom";
import { TENANT_FOOTER_LINKS } from "./footerLinks";
import { FooterLinkList } from "./FooterLinkList";

const TenantLinks: FC = () => <FooterLinkList title="Untuk Pemilik" links={TENANT_FOOTER_LINKS} />;

const TenantSignup: FC = () => (
  <div>
    <h4 className="mb-4 font-semibold text-white">Untuk Pemilik</h4>
    <ul className="space-y-2 text-sm">
      <li><Link to="/auth/register" className="font-medium text-rose-500 transition hover:text-white">Daftar Menjadi Tenant</Link></li>
      <li><p className="mt-2 text-slate-400">Sewakan properti Anda dan raih penghasilan tambahan bersama kami.</p></li>
    </ul>
  </div>
);

export const FooterOwnerLinks: FC<{ isRegularUser: boolean; isTenant: boolean }> = ({ isRegularUser, isTenant }) => {
  if (isRegularUser) return null;
  return isTenant ? <TenantLinks /> : <TenantSignup />;
};
