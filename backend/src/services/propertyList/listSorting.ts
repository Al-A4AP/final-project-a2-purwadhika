import type { ProcessedPropertyItem, PropertyItem } from "./listTypes";

const sortValueGetters: Record<string, (item: ProcessedPropertyItem) => number> = {
  popularity: (item) => item.order_count,
  price: (item) => item.min_price,
  rating: (item) => item.rating || 0,
};

const compareByOrder = (a: number, b: number, order: string) =>
  order === "asc" ? a - b : b - a;

export const applyMemorySort = (
  items: ProcessedPropertyItem[],
  sort: string,
  order: string,
) => {
  const getValue = sortValueGetters[sort];
  if (getValue) items.sort((a, b) => compareByOrder(getValue(a), getValue(b), order));
};

const getItemOrder = (id: string, order: Map<string, number>) =>
  order.get(id) ?? 0;

export const sortByIds = (items: PropertyItem[], ids: string[]) => {
  const order = new Map(ids.map((id, index) => [id, index]));
  return [...items].sort((a, b) => getItemOrder(a.id, order) - getItemOrder(b.id, order));
};
