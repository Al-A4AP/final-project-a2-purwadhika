import type { SnapTransactionInput } from './midtransTypes';

const MAX_ITEM_NAME_LENGTH = 50;

export const buildSnapParameter = (input: SnapTransactionInput) => {
  const grossAmount = normalizeAmount(input.totalPrice);
  return {
    transaction_details: { order_id: input.orderId, gross_amount: grossAmount },
    customer_details: buildCustomerDetails(input),
    item_details: [buildItemDetail(input, grossAmount)],
  };
};

const buildCustomerDetails = (input: SnapTransactionInput) => ({
  first_name: input.userName,
  email: input.userEmail,
  phone: input.userPhone || '',
});

const buildItemDetail = (input: SnapTransactionInput, grossAmount: number) => ({
  id: input.roomId,
  price: grossAmount,
  quantity: 1,
  name: truncateItemName(buildItemName(input)),
});

const buildItemName = (input: SnapTransactionInput) =>
  `${input.propertyName} - ${input.roomType} (${input.nights} Malam)`;

const truncateItemName = (name: string) =>
  name.length > MAX_ITEM_NAME_LENGTH ? `${name.slice(0, MAX_ITEM_NAME_LENGTH - 3)}...` : name;

const normalizeAmount = (amount: number) =>
  Math.round(amount);
