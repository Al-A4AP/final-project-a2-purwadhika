import { OrderStatus, Role, VoucherDiscountType, type Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';

const REWARD_DAYS = 30;
const REWARD_MAX_DISCOUNT = 50000;
const REWARD_PERCENT = 5;

type DbClient = typeof prisma | Prisma.TransactionClient;

export const buildReferralOrderData = async (tx: Prisma.TransactionClient, userId: string, code?: string) => {
  const referralCode = normalizeReferralCode(code);
  if (!referralCode) return {};
  await assertReferralUsable(tx, userId, referralCode);
  return { referral_code: referralCode };
};

export const issueReferralRewardForProcessedOrder = async (orderId: string) => {
  const order = await findRewardableOrder(orderId);
  if (!order?.referral_code) return null;
  return prisma.$transaction((tx) => createReferralReward(tx, order));
};

const createReferralReward = async (tx: Prisma.TransactionClient, order: RewardableOrder) => {
  const existing = await tx.referralReward.findUnique({ where: { orderId: order.id } });
  if (existing) return existing;
  const referrer = await findReferrerByCode(tx, order.referral_code!);
  if (!referrer || referrer.id === order.userId) return null;
  if (await findTriggeredReward(tx, order.userId)) return null;
  const voucher = await createRewardVoucher(tx, order, referrer.id);
  await createRewardAssignment(tx, referrer.id, voucher.id, voucher.expires_at);
  return tx.referralReward.create({ data: buildRewardCreateData(order, referrer.id, voucher) });
};

const assertReferralUsable = async (tx: Prisma.TransactionClient, userId: string, code: string) => {
  const referrer = await findReferrerByCode(tx, code);
  if (!referrer) throw new AppError('Kode referral tidak valid', 400);
  if (referrer.id === userId) throw new AppError('Kode referral sendiri tidak dapat digunakan', 400);
  if (await findTriggeredReward(tx, userId)) throw new AppError('Kode referral hanya dapat digunakan satu kali', 400);
};

const findRewardableOrder = (orderId: string) =>
  prisma.order.findFirst({ where: rewardableOrderWhere(orderId), include: rewardableOrderInclude });

const rewardableOrderWhere = (orderId: string): Prisma.OrderWhereInput => ({
  deleted_at: null,
  id: orderId,
  referral_code: { not: null },
  status: OrderStatus.PROCESSED,
});

const createRewardVoucher = (tx: Prisma.TransactionClient, order: RewardableOrder, referrerId: string) =>
  tx.voucher.create({ data: buildRewardVoucherData(order, referrerId) });

const createRewardAssignment = (tx: Prisma.TransactionClient, userId: string, voucherId: string, expiresAt: Date) =>
  tx.userVoucher.create({ data: { expires_at: expiresAt, userId, voucherId } });

const buildRewardCreateData = (order: RewardableOrder, referrerId: string, voucher: RewardVoucher) => ({
  orderId: order.id,
  referredUserId: order.userId,
  referrerId,
  reward_code: voucher.code,
  voucherId: voucher.id,
});

const buildRewardVoucherData = (order: RewardableOrder, referrerId: string): Prisma.VoucherCreateInput => ({
  code: buildRewardCode(order.id),
  discount_type: VoucherDiscountType.PERCENTAGE,
  discount_value: REWARD_PERCENT,
  expires_at: addRewardDays(new Date()),
  is_active: true,
  max_discount: REWARD_MAX_DISCOUNT,
  name: 'Reward Referral',
  new_user_only: false,
  quota: 1,
  starts_at: new Date(),
  tenant: { connect: { id: order.property.tenantId } },
  description: `Reward referral untuk ${referrerId.slice(-6).toUpperCase()}`,
});

const findReferrerByCode = (db: DbClient, code: string) =>
  db.user.findFirst({ where: { deleted_at: null, referral_code: normalizeReferralCode(code), role: Role.USER } });

const findTriggeredReward = (db: DbClient, referredUserId: string) =>
  db.referralReward.findFirst({ where: { referredUserId } });

const addRewardDays = (date: Date) => {
  const value = new Date(date);
  value.setDate(value.getDate() + REWARD_DAYS);
  return value;
};

const buildRewardCode = (orderId: string) =>
  `REF${Date.now().toString(36).toUpperCase()}${orderId.slice(-4).toUpperCase()}`;

const normalizeReferralCode = (code?: string) => code?.trim().toUpperCase() || '';

const rewardableOrderInclude = {
  property: { select: { tenantId: true } },
} satisfies Prisma.OrderInclude;

type RewardableOrder = NonNullable<Awaited<ReturnType<typeof findRewardableOrder>>>;
type RewardVoucher = Awaited<ReturnType<typeof createRewardVoucher>>;
