import 'dotenv/config';
import { z } from 'zod';

const productionSecrets = [
  'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_HOST',
  'CLOUDINARY_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET',
  'MIDTRANS_SERVER_KEY', 'MIDTRANS_CLIENT_KEY', 'LOCATIONIQ_TOKEN',
] as const;

const localOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];

const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && !value.trim() ? undefined : value;

const requiredText = (name: string) =>
  z.preprocess(blankToUndefined, z.string().min(1, `${name} wajib diisi`));

const optionalText = () =>
  z.preprocess(blankToUndefined, z.string().trim().optional());

const optionalFlag = (fallback: 'true' | 'false') =>
  z.preprocess(blankToUndefined, z.enum(['true', 'false']).default(fallback));

const baseEnvSchema = z.object({
  ALLOWED_ORIGINS: optionalText(),
  CLOUDINARY_API_KEY: optionalText(),
  CLOUDINARY_API_SECRET: optionalText(),
  CLOUDINARY_NAME: optionalText(),
  DATABASE_URL: requiredText('DATABASE_URL'),
  EMAIL_HOST: optionalText(),
  EMAIL_PASSWORD: optionalText(),
  EMAIL_PORT: z.preprocess(blankToUndefined, z.coerce.number().int().positive().default(587)),
  EMAIL_USER: optionalText(),
  ENABLE_CRON: optionalFlag('false'),
  FRONTEND_URL: z.preprocess(blankToUndefined, z.string().url().default('http://localhost:5173')),
  JWT_EXPIRES_IN: z.preprocess(blankToUndefined, z.string().default('7d')),
  JWT_SECRET: requiredText('JWT_SECRET'),
  LOCATIONIQ_TOKEN: optionalText(),
  MIDTRANS_CLIENT_KEY: optionalText(),
  MIDTRANS_IS_PRODUCTION: optionalFlag('false'),
  MIDTRANS_SERVER_KEY: optionalText(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.preprocess(blankToUndefined, z.coerce.number().int().positive().default(5000)),
});

function validateProductionSecrets(data: z.infer<typeof baseEnvSchema>, ctx: z.RefinementCtx) {
  if (data.NODE_ENV !== 'production') return;
  productionSecrets.forEach((key) => addMissingSecretIssue(data, ctx, key));
}

export const env = baseEnvSchema.superRefine(validateProductionSecrets).parse(process.env);

export const getAllowedOrigins = () =>
  env.ALLOWED_ORIGINS ? splitOrigins(env.ALLOWED_ORIGINS) : localOrigins;

const addMissingSecretIssue = (data: z.infer<typeof baseEnvSchema>, ctx: z.RefinementCtx, key: ProductionSecret) => {
  if (data[key]) return;
  ctx.addIssue({ code: 'custom', path: [key], message: `${key} wajib diisi pada production` });
};

const splitOrigins = (origins: string) =>
  origins.split(',').map((origin) => origin.trim()).filter(Boolean);

type ProductionSecret = typeof productionSecrets[number];
