import type { FC } from "react";
import { Link } from "react-router-dom";

interface FooterLinkListProps {
  links: Array<{ label: string; to: string }>;
  title: string;
}

export const FooterLinkList: FC<FooterLinkListProps> = ({ links, title }) => (
  <div>
    <h4 className="mb-4 font-semibold text-white">{title}</h4>
    <ul className="space-y-2 text-sm">{links.map((link) => <li key={link.to}><Link to={link.to} className="transition hover:text-white">{link.label}</Link></li>)}</ul>
  </div>
);
