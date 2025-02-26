// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL
//     }
//   },
//   log: ['query', 'error', 'warn']
// });

// export default prisma;

import { PrismaClient as GlobalClient } from '../../generated/global';

export const global = new GlobalClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_GLOBAL,
    },
  },
});