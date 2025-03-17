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
import { PrismaClient as GroupClient } from '../../generated/group';

export const global = new GlobalClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_GLOBAL,
    },
  },
});

export const group = new GroupClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_GROUP,
    },
  },
});