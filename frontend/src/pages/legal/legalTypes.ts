export interface LegalPoint {
  body: string;
  title: string;
}

export interface LegalSectionData {
  id: "privacy" | "terms";
  label: string;
  summary: string;
  title: string;
  points: LegalPoint[];
}
