import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  TZ: process.env.TZ || 'America/Argentina/Buenos_Aires'
};

if (!env.MONGO_URI) {
  console.warn('MONGO_URI not set. Please set in .env');
}
