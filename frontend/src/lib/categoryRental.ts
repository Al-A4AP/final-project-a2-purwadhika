const WHOLE_UNIT_CATEGORIES = ["Rumah", "Villa"];

export const isWholeUnitCategory = (name?: string | null) =>
  WHOLE_UNIT_CATEGORIES.includes(name || "");
