import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'ownership-test-secret';

type PrismaClientInstance = typeof import('../../src/config/prisma').default;
type UserCancelOrderModule = typeof import('../../src/services/order/userCancelOrder');
type UserMidtransOrderModule = typeof import('../../src/services/order/userMidtransOrder');
type RoomOwnershipModule = typeof import('../../src/services/tenantRoom/roomOwnership');
type ReviewServiceModule = typeof import('../../src/services/reviewService');
type CategoryServiceModule = typeof import('../../src/services/categoryService');
type VoucherServiceModule = typeof import('../../src/services/voucherService');

const prisma = require('../../src/config/prisma').default as PrismaClientInstance;
const { cancelUserOrder } = require('../../src/services/order/userCancelOrder') as UserCancelOrderModule;
const { retryUserMidtransPayment } = require('../../src/services/order/userMidtransOrder') as UserMidtransOrderModule;
const { ensureTenantProperty, verifyPeakRateOwner, verifyRoomOwner } = require('../../src/services/tenantRoom/roomOwnership') as RoomOwnershipModule;
const { deleteTenantReview, replyReview } = require('../../src/services/reviewService') as ReviewServiceModule;
const { createCategory, updateCategory } = require('../../src/services/categoryService') as CategoryServiceModule;
const { applyVoucherToOrder, previewUserVoucher } = require('../../src/services/voucherService') as VoucherServiceModule;
const restoreFns: Array<() => void> = [];

afterEach(() => restoreMocks());

describe('ownership regression', () => {
  it('rejects manual cancellation when order does not belong to user', async () => {
    let query: unknown;
    let updateCalls = 0;
    replaceMethod(prisma.order, 'findFirst', async (args: object) => { query = args; return null; });
    replaceMethod(prisma.order, 'update', async () => { updateCalls += 1; return { id: 'order-1' }; });

    await expectRejected(cancelUserOrder('order-1', 'user-1'), 'Pesanan tidak ditemukan atau akses ditolak', 404);

    assert.deepEqual(getWhere(query), { id: 'order-1', userId: 'user-1' });
    assert.equal(updateCalls, 0);
  });

  it('rejects Midtrans retry when order does not belong to user', async () => {
    let query: unknown;
    let updateCalls = 0;
    replaceMethod(prisma.order, 'findFirst', async (args: object) => { query = args; return null; });
    replaceMethod(prisma.order, 'update', async () => { updateCalls += 1; return { id: 'order-1' }; });

    await expectRejected(retryUserMidtransPayment('order-1', 'user-1'), 'Pesanan tidak ditemukan atau akses ditolak', 404);

    assert.deepEqual(getWhere(query), { id: 'order-1', userId: 'user-1' });
    assert.equal(updateCalls, 0);
  });

  it('rejects tenant property access outside owner scope', async () => {
    let query: unknown;
    replaceMethod(prisma.property, 'findFirst', async (args: object) => { query = args; return null; });

    await expectRejected(ensureTenantProperty('property-1', 'tenant-1'), 'Properti tidak ditemukan', 404);

    assert.deepEqual(getWhere(query), { id: 'property-1', tenantId: 'tenant-1', deleted_at: null });
  });

  it('rejects room access when room belongs to another tenant', async () => {
    replaceMethod(prisma.room, 'findFirst', async () => buildRoomForTenant('tenant-2'));

    await expectRejected(verifyRoomOwner('room-1', 'tenant-1'), 'Kamar tidak ditemukan', 404);
  });

  it('rejects peak rate access when rate belongs to another tenant', async () => {
    replaceMethod(prisma.peakSeasonRate, 'findFirst', async () => buildPeakRateForTenant('tenant-2'));

    await expectRejected(verifyPeakRateOwner('rate-1', 'tenant-1'), 'Rate tidak ditemukan', 404);
  });

  it('rejects review reply when review property belongs to another tenant', async () => {
    let createCalls = 0;
    replaceMethod(prisma.review, 'findFirst', async () => buildReviewForTenant('tenant-2'));
    replaceMethod(prisma.reviewReply, 'create', async () => { createCalls += 1; return { id: 'reply-1' }; });

    await expectRejected(replyReview('tenant-1', 'review-1', 'Terima kasih'), 'Review tidak ditemukan atau Anda tidak berhak membalas');

    assert.equal(createCalls, 0);
  });

  it('rejects review deletion when review property belongs to another tenant', async () => {
    let transactionCalls = 0;
    replaceMethod(prisma.review, 'findFirst', async () => buildReviewForTenant('tenant-2'));
    replaceMethod(prisma, '$transaction', async () => { transactionCalls += 1; return []; });

    await expectRejected(deleteTenantReview('tenant-1', 'review-1'), 'Review tidak ditemukan atau Anda tidak berhak menghapus');

    assert.equal(transactionCalls, 0);
  });

  it('rejects category update outside owner scope', async () => {
    replaceMethod(prisma.propertyCategory, 'findUnique', async () => ({ id: 'category-1', name: 'Glamping', tenantId: 'tenant-2' }));

    await expectRejected(
      updateCategory('category-1', 'tenant-1', { name: 'Eco Glamping', default_rental_type: 'PER_ROOM' }),
      'Anda tidak memiliki akses untuk mengubah kategori ini.',
      403,
    );
  });

  it('rejects category creation after five owned categories', async () => {
    let createCalls = 0;
    replaceTransactionWithPrisma();
    replaceMethod(prisma, '$executeRaw', async () => 0);
    replaceMethod(prisma.propertyCategory, 'count', async () => 5);
    replaceMethod(prisma.propertyCategory, 'create', async () => { createCalls += 1; return { id: 'category-6' }; });

    await expectRejected(
      createCategory('tenant-1', { name: 'Cabin', default_rental_type: 'WHOLE_PROPERTY' }),
      'Maksimal 5 kategori milik sendiri per tenant.',
      400,
    );

    assert.equal(createCalls, 0);
  });

  it('counts only owned categories when enforcing category limit', async () => {
    let countQuery: unknown;
    replaceTransactionWithPrisma();
    replaceMethod(prisma, '$executeRaw', async () => 0);
    replaceMethod(prisma.propertyCategory, 'count', async (args: object) => { countQuery = args; return 4; });
    replaceMethod(prisma.propertyCategory, 'findFirst', async () => null);
    replaceMethod(prisma.propertyCategory, 'create', async () => ({ id: 'category-5', tenantId: 'tenant-1' }));

    await createCategory('tenant-1', { name: 'Cabin', default_rental_type: 'WHOLE_PROPERTY' });

    assert.deepEqual(getWhere(countQuery), { tenantId: 'tenant-1' });
  });

  it('allows Tenant A voucher for Tenant A property', async () => {
    mockVoucherOwnership('tenant-a', buildVoucher('tenant-a', 'PERCENTAGE'));
    replaceMethod(prisma.userVoucher, 'count', async () => 0);

    const result = await previewUserVoucher('user-1', buildVoucherPreviewInput());

    assert.equal(result.discountAmount, 10000);
    assert.equal(result.finalPrice, 90000);
  });

  it('rejects Tenant A voucher preview for Tenant B property', async () => {
    mockVoucherOwnership('tenant-b', buildVoucher('tenant-a', 'PERCENTAGE'));

    await expectRejected(
      previewUserVoucher('user-1', buildVoucherPreviewInput()),
      'Voucher tidak berlaku untuk properti ini.',
      400,
    );
  });

  it('rejects assigned Tenant A voucher for Tenant B before usage changes', async () => {
    const calls = mockVoucherUsageCalls();
    mockVoucherOwnership('tenant-b', buildVoucher('tenant-a', 'PERCENTAGE'));

    await expectCrossTenantCheckoutRejected();

    assert.deepEqual(calls, { assignment: 0, quota: 0 });
  });

  it('rejects Tenant A FREE_NIGHTS voucher for Tenant B before quota changes', async () => {
    const calls = mockVoucherUsageCalls();
    mockVoucherOwnership('tenant-b', buildVoucher('tenant-a', 'FREE_NIGHTS'));

    await expectCrossTenantCheckoutRejected();

    assert.deepEqual(calls, { assignment: 0, quota: 0 });
  });

  it('rejects Tenant A PERCENTAGE voucher for Tenant B before quota changes', async () => {
    const calls = mockVoucherUsageCalls();
    mockVoucherOwnership('tenant-b', buildVoucher('tenant-a', 'PERCENTAGE'));

    await expectCrossTenantCheckoutRejected();

    assert.deepEqual(calls, { assignment: 0, quota: 0 });
  });
});

const replaceMethod = (target: object, methodName: string, replacement: (...args: Array<unknown>) => unknown) => {
  const original = Reflect.get(target, methodName);
  Reflect.set(target, methodName, replacement);
  restoreFns.push(() => { Reflect.set(target, methodName, original); });
};

const restoreMocks = () => {
  while (restoreFns.length) restoreFns.pop()?.();
};

const replaceTransactionWithPrisma = () => {
  replaceMethod(prisma, '$transaction', async (callback: unknown) => {
    if (typeof callback !== 'function') throw new Error('Expected transaction callback');
    return Reflect.apply(callback, undefined, [prisma]);
  });
};

const expectRejected = async (promise: Promise<unknown>, message: string, statusCode?: number) => {
  await assert.rejects(promise, (error: unknown) => {
    assert.equal(getErrorMessage(error), message);
    if (statusCode) assert.equal(getStatusCode(error), statusCode);
    return true;
  });
};

const getWhere = (query: unknown) =>
  isRecord(query) ? query.where : undefined;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : '';

const getStatusCode = (error: unknown) =>
  isRecord(error) ? error.statusCode : undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const buildRoomForTenant = (tenantId: string) =>
  ({ id: 'room-1', property: { tenantId, category: { name: 'Hotel' } } });

const buildPeakRateForTenant = (tenantId: string) =>
  ({ id: 'rate-1', room: { property: { tenantId } } });

const buildReviewForTenant = (tenantId: string) =>
  ({ id: 'review-1', property: { tenantId } });

const mockVoucherOwnership = (propertyTenantId: string, voucher: ReturnType<typeof buildVoucher>) => {
  replaceMethod(prisma.property, 'findFirst', async () => ({ tenantId: propertyTenantId }));
  replaceMethod(prisma.voucher, 'findFirst', async () => voucher);
};

const mockVoucherUsageCalls = () => {
  const calls = { assignment: 0, quota: 0 };
  replaceMethod(prisma.userVoucher, 'count', async () => { calls.assignment += 1; return 1; });
  replaceMethod(prisma.voucher, 'updateMany', async () => { calls.quota += 1; return { count: 1 }; });
  return calls;
};

const expectCrossTenantCheckoutRejected = () =>
  expectRejected(
    applyVoucherToOrder(prisma, 'property-1', 'TENANTA10', 'user-1', {
      subtotal: 100000,
      totalNights: 2,
    }),
    'Voucher tidak berlaku untuk properti ini.',
    400,
  );

const buildVoucherPreviewInput = () => ({
  propertyId: 'property-1',
  subtotal: 100000,
  total_nights: 2,
  voucher_code: 'TENANTA10',
});

const buildVoucher = (tenantId: string, discountType: 'PERCENTAGE' | 'FREE_NIGHTS') => ({
  ...voucherFixture,
  tenantId,
  discount_type: discountType,
  discount_value: discountType === 'PERCENTAGE' ? 10 : 1,
});

const voucherFixture = {
  id: 'voucher-a',
  code: 'TENANTA10',
  name: 'Voucher Tenant A',
  description: null,
  max_discount: null,
  quota: 10,
  used_count: 0,
  starts_at: new Date('2026-01-01T00:00:00.000Z'),
  expires_at: new Date('2027-01-01T00:00:00.000Z'),
  is_active: true,
  new_user_only: false,
  deleted_at: null,
  created_at: new Date('2026-01-01T00:00:00.000Z'),
  updated_at: new Date('2026-01-01T00:00:00.000Z'),
};
