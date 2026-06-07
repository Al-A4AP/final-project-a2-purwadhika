import { Prisma, VoucherDiscountType, type Voucher } from '@prisma/client';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { VoucherInput, VoucherPreviewInput } from '../validations/voucherValidation';

type DbClient = typeof prisma | Prisma.TransactionClient;

export const listTenantVouchers = (tenantId: string) =>
  prisma.voucher.findMany({ where: { tenantId, deleted_at: null, userVouchers: { none: {} } }, orderBy: { created_at: 'desc' } });

export const createTenantVoucher = async (tenantId: string, data: VoucherInput) => {
  await assertVoucherCodeAvailable(data.code);
  return prisma.voucher.create({ data: buildVoucherCreateData(tenantId, data) });
};

export const updateTenantVoucher = async (id: string, tenantId: string, data: VoucherInput) => {
  const voucher = await findTenantVoucherOrThrow(id, tenantId);
  await assertVoucherCodeAvailable(data.code, voucher.id);
  return prisma.voucher.update({ where: { id }, data: buildVoucherUpdateData(data) });
};

export const deleteTenantVoucher = async (id: string, tenantId: string) => {
  await findTenantVoucherOrThrow(id, tenantId);
  return prisma.voucher.update({ where: { id }, data: { deleted_at: new Date(), is_active: false } });
};

export const previewUserVoucher = async (userId: string, input: VoucherPreviewInput) => {
  await ensureUserReferralCode(userId);
  const voucher = await findActiveVoucherForProperty(prisma, input.propertyId, input.voucher_code);
  await assertAssignedVoucherAccess(prisma, userId, voucher.id);
  await assertNewUserVoucherAllowed(prisma, userId, voucher);
  const discountAmount = calculateDiscount(input.subtotal, voucher, input.total_nights);
  return { discountAmount, finalPrice: input.subtotal - discountAmount, voucher: serializeVoucher(voucher) };
};

export const getUserVoucherSummary = async (userId: string) => {
  const user = await ensureUserReferralCode(userId);
  const vouchers = mergeVouchers(await findAssignedActiveVouchers(userId), await findPublicActiveVouchers());
  return { referralCode: user.referral_code, vouchers: vouchers.map(serializeVoucher) };
};

export const applyVoucherToOrder = async (tx: Prisma.TransactionClient, propertyId: string, code: string | undefined, subtotal: number, userId: string, total_nights = 1) => {
  if (!code?.trim()) return buildNoVoucherResult(subtotal);
  const voucher = await findActiveVoucherForProperty(tx, propertyId, code);
  await assertAssignedVoucherAccess(tx, userId, voucher.id);
  await assertNewUserVoucherAllowed(tx, userId, voucher);
  assertVoucherQuota(voucher);
  const discountAmount = calculateDiscount(subtotal, voucher, total_nights);
  await tx.voucher.update({ where: { id: voucher.id }, data: { used_count: { increment: 1 } } });
  await markAssignedVoucherUsed(tx, userId, voucher.id);
  return { discountAmount, subtotalPrice: subtotal, totalPrice: subtotal - discountAmount, voucherId: voucher.id };
};

const findTenantVoucherOrThrow = async (id: string, tenantId: string) => {
  const voucher = await prisma.voucher.findFirst({ where: { id, tenantId, deleted_at: null, userVouchers: { none: {} } } });
  if (!voucher) throw new AppError('Voucher tidak ditemukan', 404);
  return voucher;
};

const findActiveVoucherForProperty = async (db: DbClient, propertyId: string, code: string) => {
  const tenantId = await findPropertyTenantId(db, propertyId);
  const voucher = await db.voucher.findFirst({ where: buildActiveVoucherWhere(tenantId, code) });
  if (!voucher) throw new AppError('Voucher tidak valid atau sudah tidak aktif', 400);
  assertVoucherQuota(voucher);
  return voucher;
};

const findPropertyTenantId = async (db: DbClient, propertyId: string) => {
  const property = await db.property.findFirst({ where: { id: propertyId, deleted_at: null }, select: { tenantId: true } });
  if (!property) throw new AppError('Properti tidak ditemukan', 404);
  return property.tenantId;
};

const buildActiveVoucherWhere = (tenantId: string, code: string): Prisma.VoucherWhereInput => ({
  code: normalizeVoucherCode(code),
  deleted_at: null,
  expires_at: { gte: new Date() },
  is_active: true,
  starts_at: { lte: new Date() },
  tenantId,
});

const assertVoucherCodeAvailable = async (code: string, exceptId?: string) => {
  const existing = await prisma.voucher.findFirst({ where: { code: normalizeVoucherCode(code), ...(exceptId ? { id: { not: exceptId } } : {}) } });
  if (existing) throw new AppError('Kode voucher sudah digunakan', 400);
};

const assertVoucherQuota = (voucher: Pick<Voucher, 'quota' | 'used_count'>) => {
  if (voucher.quota !== null && voucher.used_count >= voucher.quota) throw new AppError('Kuota voucher sudah habis', 400);
};

const assertAssignedVoucherAccess = async (db: DbClient, userId: string, voucherId: string) => {
  if (!await hasVoucherAssignments(db, voucherId)) return;
  if (await findUsableAssignedVoucher(db, userId, voucherId)) return;
  throw new AppError('Voucher ini tidak tersedia untuk akun Anda', 403);
};

const assertNewUserVoucherAllowed = async (db: DbClient, userId: string, voucher: Pick<Voucher, 'new_user_only'>) => {
  if (!voucher.new_user_only) return;
  const existingOrders = await db.order.count({ where: { userId, deleted_at: null } });
  if (existingOrders > 0) throw new AppError('Voucher ini khusus pengguna baru', 400);
};

const markAssignedVoucherUsed = async (db: DbClient, userId: string, voucherId: string) => {
  const assignment = await findUsableAssignedVoucher(db, userId, voucherId);
  if (!assignment) return;
  await db.userVoucher.update({ where: { id: assignment.id }, data: { used_at: new Date() } });
};

const calculateDiscount = (subtotal: number, voucher: Pick<Voucher, 'discount_type' | 'discount_value' | 'max_discount'>, total_nights = 1) => {
  let raw = 0;
  if (voucher.discount_type === 'FREE_NIGHTS') {
    raw = Math.floor((subtotal / total_nights) * voucher.discount_value);
  } else if (voucher.discount_type === VoucherDiscountType.PERCENTAGE) {
    raw = Math.floor((subtotal * voucher.discount_value) / 100);
  } else {
    raw = voucher.discount_value;
  }
  const cappedDiscount = voucher.max_discount ? Math.min(raw, voucher.max_discount) : raw;
  if (voucher.discount_type !== 'FREE_NIGHTS') {
    return Math.min(cappedDiscount, Math.floor(subtotal * 0.9));
  }
  return Math.min(cappedDiscount, subtotal);
};

const ensureUserReferralCode = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId, deleted_at: null } });
  if (!user) throw new AppError('User tidak ditemukan', 404);
  if (user.referral_code) return user;
  return prisma.user.update({ where: { id: userId }, data: { referral_code: buildReferralCode(user.name, user.id) } });
};

const findPublicActiveVouchers = () =>
  prisma.voucher.findMany({ where: { ...buildPublicVoucherWhere(), deleted_at: null, userVouchers: { none: {} } }, orderBy: { expires_at: 'asc' }, take: 12 });

const findAssignedActiveVouchers = async (userId: string) => {
  const assignments = await prisma.userVoucher.findMany({
    where: { userId, ...usableAssignedVoucherWhere(), voucher: { ...buildPublicVoucherWhere(), deleted_at: null } },
    include: { voucher: true }, orderBy: { created_at: 'desc' }, take: 12,
  });
  return assignments.map((assignment) => assignment.voucher);
};

const findUsableAssignedVoucher = (db: DbClient, userId: string, voucherId: string) =>
  db.userVoucher.findFirst({ where: { userId, voucherId, ...usableAssignedVoucherWhere() } });

const hasVoucherAssignments = async (db: DbClient, voucherId: string) =>
  (await db.userVoucher.count({ where: { voucherId } })) > 0;

const usableAssignedVoucherWhere = () => ({
  used_at: null,
  OR: [{ expires_at: null }, { expires_at: { gte: new Date() } }],
});

const buildPublicVoucherWhere = () => ({ expires_at: { gte: new Date() }, is_active: true, starts_at: { lte: new Date() } });

const mergeVouchers = (primary: Voucher[], secondary: Voucher[]) => {
  const ids = new Set(primary.map((voucher) => voucher.id));
  return [...primary, ...secondary.filter((voucher) => !ids.has(voucher.id))];
};

const buildVoucherCreateData = (tenantId: string, data: VoucherInput) => ({ ...buildVoucherUpdateData(data), tenantId });

const buildVoucherUpdateData = (data: VoucherInput) => {
  const starts_at = new Date(data.starts_at);
  starts_at.setHours(0, 0, 0, 0);
  const expires_at = new Date(data.expires_at);
  expires_at.setHours(23, 59, 59, 999);
  return {
    code: normalizeVoucherCode(data.code),
    description: data.description || null,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    expires_at,
    is_active: data.is_active ?? true,
    max_discount: data.max_discount || null,
    name: data.name || normalizeVoucherCode(data.code),
    new_user_only: data.new_user_only ?? false,
    quota: data.quota || null,
    starts_at,
  };
};

const serializeVoucher = (voucher: Voucher) => ({ ...voucher, code: voucher.code });
const normalizeVoucherCode = (code: string) => code.trim().toUpperCase();
const buildNoVoucherResult = (subtotal: number) => ({ discountAmount: 0, subtotalPrice: subtotal, totalPrice: subtotal, voucherId: null });
const buildReferralCode = (name: string, id: string) => `${name.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase() || 'USER'}${id.slice(-6).toUpperCase()}`;
