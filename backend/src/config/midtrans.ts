import 'dotenv/config';
import { env } from './env';
const midtransClient = require('midtrans-client');

export const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: env.MIDTRANS_SERVER_KEY || '',
  clientKey: env.MIDTRANS_CLIENT_KEY || '',
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: env.MIDTRANS_SERVER_KEY || '',
  clientKey: env.MIDTRANS_CLIENT_KEY || '',
});
