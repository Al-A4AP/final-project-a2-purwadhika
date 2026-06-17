import { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';

export type DbClient = typeof prisma | Prisma.TransactionClient;
