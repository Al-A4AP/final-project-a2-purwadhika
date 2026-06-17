import { Prisma, type Voucher } from '@prisma/client';
import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import { calculateDiscount, getPayableTotal, type VoucherPricing } from './voucher/voucherDiscount';
import {
  assertAssignedVoucherAccess,
  assertNewUserVoucherAllowed,
  assertSupportedVoucher,
  assertVoucherQuota,
} from './voucher/voucherGuards';
import {
  assertVoucherCodeAvailable,
  findActiveVoucherForProperty,
  findAssignedActiveVouchers,
  findTenantVoucherOrThrow,
  findUsableAssignedVoucher,
} from './voucher/voucherQueries';
import {
  buildNoVoucherResult,
  buildVoucherCreateData,
  buildVoucherUpdateData,
  serializeVoucher,
} from './voucher/voucherSerializer';
import type { DbClient } from './voucher/voucherTypes';
import { getVoucherPreviewPricing } from './voucher/voucherPreviewPricing';
import type { VoucherInput, VoucherPreviewInput } from '../validations/voucherValidation';

export const listTenantVouchers = async (tenantId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = { tenantId, deleted_at: null, userVouchers: { none: {} } };
  const [data, total] = await Promise.all([
    prisma.voucher.findMany({ where, orderBy: { created_at: 'desc' }, skip, take: limit }),
    prisma.voucher.count({ where })
  ]);
  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

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

export const assignVoucherToUser = async (tenantId: string, voucherId: string, userEmail: string) => {
  const voucher = await findTenantVoucherOrThrow(voucherId, tenantId);
  const targetUser = await prisma.user.findUnique({ where: { email: userEmail, deleted_at: null } });
  if (!targetUser) throw new AppError('Pengguna dengan email tersebut tidak ditemukan', 404);
  
  const existingAssignment = await prisma.userVoucher.findUnique({
    where: { userId_voucherId: { userId: targetUser.id, voucherId: voucher.id } }
  });
  if (existingAssignment) throw new AppError('Voucher sudah diberikan kepada pengguna ini', 400);

  return prisma.userVoucher.create({
    data: { userId: targetUser.id, voucherId: voucher.id, expires_at: voucher.expires_at }
  });
};

export const previewUserVoucher = async (userId: string, input: VoucherPreviewInput) => {
  const voucher = await getValidatedActiveVoucher(prisma, input.propertyId, input.voucher_code);
  const pricing = await getVoucherPreviewPricing(input);
  await assertAssignedVoucherAccess(prisma, userId, voucher.id);
  await assertNewUserVoucherAllowed(prisma, userId, voucher);
  const discountAmount = calculateDiscount(pricing, voucher);
  return { discountAmount, finalPrice: getPayableTotal(pricing.subtotal, discountAmount), voucher: serializeVoucher(voucher) };
};

export const getUserVoucherSummary = async (userId: string) => {
  const assignedVouchers = await findAssignedActiveVouchers(userId);
  return { vouchers: assignedVouchers.map(serializeVoucher) };
};

export const applyVoucherToOrder = async (tx: Prisma.TransactionClient, propertyId: string, code: string | undefined, userId: string, pricing: VoucherPricing) => {
  if (!code?.trim()) return buildNoVoucherResult(pricing.subtotal);
  const voucher = await getValidatedActiveVoucher(tx, propertyId, code);
  await assertAssignedVoucherAccess(tx, userId, voucher.id);
  await assertNewUserVoucherAllowed(tx, userId, voucher);
  const discountAmount = calculateDiscount(pricing, voucher);
  await incrementVoucherUsage(tx, voucher);
  await markAssignedVoucherUsed(tx, userId, voucher.id);
  return { discountAmount, subtotalPrice: pricing.subtotal, totalPrice: getPayableTotal(pricing.subtotal, discountAmount), voucherId: voucher.id };
};

const getValidatedActiveVoucher = async (db: DbClient, propertyId: string, code: string) => {
  const voucher = await findActiveVoucherForProperty(db, propertyId, code);
  assertSupportedVoucher(voucher);
  assertVoucherQuota(voucher);
  return voucher;
};

const incrementVoucherUsage = async (db: DbClient, voucher: Pick<Voucher, 'id' | 'quota'>) => {
  const result = await db.voucher.updateMany({
    where: buildVoucherQuotaWhere(voucher),
    data: { used_count: { increment: 1 } },
  });
  if (result.count !== 1) throw new AppError('Kuota voucher sudah habis', 400);
};

const buildVoucherQuotaWhere = (voucher: Pick<Voucher, 'id' | 'quota'>): Prisma.VoucherWhereInput =>
  voucher.quota === null ? { id: voucher.id } : { id: voucher.id, used_count: { lt: voucher.quota } };

const markAssignedVoucherUsed = async (db: DbClient, userId: string, voucherId: string) => {
  const assignment = await findUsableAssignedVoucher(db, userId, voucherId);
  if (!assignment) return;
  await db.userVoucher.update({ where: { id: assignment.id }, data: { used_at: new Date() } });
};
