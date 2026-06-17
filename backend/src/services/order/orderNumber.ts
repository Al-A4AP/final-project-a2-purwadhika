export const generateOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
