import type { FC } from "react";
import { FooterBrand } from "./FooterBrand";
import { FooterContact } from "./FooterContact";
import { FooterLinkList } from "./FooterLinkList";
import { FooterOwnerLinks } from "./FooterOwnerLinks";
import { FOOTER_NAV_LINKS } from "./footerLinks";

export const FooterGrid: FC<{ isRegularUser: boolean; isTenant: boolean }> = ({ isRegularUser, isTenant }) => (
  <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
    <FooterBrand />
    <FooterLinkList title="Navigasi" links={FOOTER_NAV_LINKS} />
    <FooterOwnerLinks isRegularUser={isRegularUser} isTenant={isTenant} />
    <FooterContact />
  </div>
);
