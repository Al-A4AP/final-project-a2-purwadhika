import prisma from '../config/prisma';

export const getTenantReviews = async (tenantId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        property: { tenantId },
        deleted_at: null
      },
      include: {
        user: { select: { name: true, avatar_url: true } },
        property: { select: { id: true, name: true } },
        replies: {
          where: { deleted_at: null }
        }
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({
      where: {
        property: { tenantId },
        deleted_at: null
      }
    })
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
