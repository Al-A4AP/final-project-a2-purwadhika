import type { SnapTransactionInput } from './midtransTypes';

export const buildSnapParameter = (input: SnapTransactionInput) => ({
  transaction_details: {
    order_id: input.orderId,
    gross_amount: input.totalPrice,
  },
  customer_details: {
    first_name: input.userName,
    email: input.userEmail,
    phone: input.userPhone || '',
  },
  item_details: [buildItemDetail(input)],
});

const buildItemDetail = (input: SnapTransactionInput) => ({
  id: input.roomId,
  price: Math.round(input.totalPrice / input.nights),
  quantity: input.nights,
  name: `${input.propertyName} - ${input.roomType} (${input.nights} Malam)`,
});
