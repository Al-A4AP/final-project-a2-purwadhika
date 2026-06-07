export const isWholeUnitCategory = (categoryName?: string, rentalType?: string) => {
  if (rentalType) return rentalType === "WHOLE_PROPERTY";
  return ["Villa", "Rumah"].includes(categoryName || "");
};
