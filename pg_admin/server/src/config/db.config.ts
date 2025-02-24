import { PrismaClient as GlobalClient } from '../../generated/global';

export const global = new GlobalClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_GLOBAL,
      },
    },
  });