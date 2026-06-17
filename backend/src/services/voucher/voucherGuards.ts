import { VoucherDiscountType, type Voucher } from '@prisma/client';
import { AppError } from '../../middlewares/errorHandler';
import {
  findUsableAssignedVoucher,
  hasVoucherAssignments,
} from './voucherQueries';
import type { DbClient } from './voucherTypes';

export const assertVoucherQuota = (voucher: Pick<Voucher, 'quota' | 'used_count'>) => {
  if (voucher.quota !== null && voucher.used_count >= voucher.quota) {
    throw new AppError('Kuota voucher sudah habis', 400);
  }
};

export const assertSupportedVoucher = (voucher: Pick<Voucher, 'discount_type'>) => {
  if (voucher.discount_type === VoucherDiscountType.NOMINAL) {
    throw new AppError('Voucher nominal tidak didukung', 400);
  }
};

export const assertAssignedVoucherAccess = async (
  db: DbClient,
  userId: string,
  voucherId: string,
) => {
  if (!await hasVoucherAssignments(db, voucherId)) return;
  if (await findUsableAssignedVoucher(db, userId, voucherId)) return;
  throw new AppError('Voucher ini tidak tersedia untuk akun Anda', 403);
};

export const assertNewUserVoucherAllowed = async (
  db: DbClient,
  userId: string,
  voucher: Pick<Voucher, 'new_user_only'>,
) => {
  if (!voucher.new_user_only) return;
  const existingOrders = await db.order.count({ where: { userId, deleted_at: null } });
  if (existingOrders > 0) throw new AppError('Voucher ini khusus pengguna baru', 400);
};
