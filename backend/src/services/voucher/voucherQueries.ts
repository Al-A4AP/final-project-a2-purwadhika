import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { normalizeVoucherCode } from './voucherSerializer';
import type { DbClient } from './voucherTypes';

export const findTenantVoucherOrThrow = async (id: string, tenantId: string) => {
  const voucher = await prisma.voucher.findFirst({
    where: { id, tenantId, deleted_at: null, userVouchers: { none: {} } },
  });
  if (!voucher) throw new AppError('Voucher tidak ditemukan', 404);
  return voucher;
};

export const findActiveVoucherForProperty = async (
  db: DbClient,
  propertyId: string,
  code: string,
) => {
  const tenantId = await findPropertyTenantId(db, propertyId);
  const voucher = await db.voucher.findFirst({
    where: buildActiveVoucherWhere(tenantId, code),
  });
  if (!voucher) throw new AppError('Voucher tidak valid atau sudah tidak aktif', 400);
  return voucher;
};

export const assertVoucherCodeAvailable = async (code: string, exceptId?: string) => {
  const existing = await prisma.voucher.findFirst({
    where: buildVoucherCodeWhere(code, exceptId),
  });
  if (existing) throw new AppError('Kode voucher sudah digunakan', 400);
};

export const findAssignedActiveVouchers = async (userId: string) => {
  const assignments = await prisma.userVoucher.findMany({
    where: { userId, ...usableAssignedVoucherWhere(), voucher: { ...buildPublicVoucherWhere(), deleted_at: null } },
    include: { voucher: true }, orderBy: { created_at: 'desc' }, take: 12,
  });
  return assignments.map((assignment) => assignment.voucher);
};

export const findUsableAssignedVoucher = (db: DbClient, userId: string, voucherId: string) =>
  db.userVoucher.findFirst({ where: { userId, voucherId, ...usableAssignedVoucherWhere() } });

export const hasVoucherAssignments = async (db: DbClient, voucherId: string) =>
  (await db.userVoucher.count({ where: { voucherId } })) > 0;

const findPropertyTenantId = async (db: DbClient, propertyId: string) => {
  const property = await db.property.findFirst({
    where: { id: propertyId, deleted_at: null },
    select: { tenantId: true },
  });
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

const buildVoucherCodeWhere = (code: string, exceptId?: string): Prisma.VoucherWhereInput => ({
  code: normalizeVoucherCode(code),
  ...(exceptId ? { id: { not: exceptId } } : {}),
});

const usableAssignedVoucherWhere = () => ({
  used_at: null,
  OR: [{ expires_at: null }, { expires_at: { gte: new Date() } }],
});

const buildPublicVoucherWhere = () => ({
  expires_at: { gte: new Date() },
  is_active: true,
  starts_at: { lte: new Date() },
});
