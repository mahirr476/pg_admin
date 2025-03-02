// // src/config/init.db.ts
// import { global } from './db.config';

// async function initializeDatabase() {
//   try {
//     await global.$connect();
    
//     // Create default role if it doesn't exist
//     await global.role.upsert({
//       where: { name: 'User' },
//       update: {},
//       create: {
//         name: 'User',
//         status: 'ACTIVE'
//       }
//     });

//     console.log('Database initialized successfully');
//   } catch (error) {
//     console.error('Database initialization failed:', error);
//     throw error;
//   }
// }

// export default initializeDatabase;



// src/config/init.db.ts
import { global } from './db.config';
import { exec } from 'child_process';
import * as path from 'path';

function runMigration(): Promise<void> {
  return new Promise((resolve, reject) => {
    const schemaPath = path.resolve(__dirname, '../../prisma/global/schema.prisma');
    console.log('Running migrations with schema path:', schemaPath);
    
    exec(`npx prisma migrate deploy --schema=${schemaPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Migration failed:', stderr);
        reject(error);
        return;
      }
      console.log('Migration output:', stdout);
      resolve();
    });
  });
}

async function initializeDatabase() {
  try {
    // First connect to the database
    await global.$connect();
    
    // Check if the Role table exists
    try {
      const result = await global.$queryRaw`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'Role'
      );`;
      
      // @ts-ignore
      const tableExists = result[0]?.exists || false;
      
      if (!tableExists) {
        console.log('Role table does not exist, running migrations...');
        await runMigration();
      }
    } catch (error) {
      console.log('Error checking table existence, attempting migrations...', error);
      await runMigration();
    }
    
    // Now try to create the role (after migrations have run)
    await global.role.upsert({
      where: { name: 'User' },
      update: {},
      create: {
        name: 'User',
        status: 'ACTIVE'
      }
    });
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export default initializeDatabase;