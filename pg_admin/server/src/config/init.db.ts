// // src/config/init.db.ts
// import { global } from './db.config';
// import { exec } from 'child_process';
// import * as path from 'path';

// function runMigration(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const schemaPath = path.resolve(__dirname, '../../prisma/global/schema.prisma');
//     console.log('Running migrations with schema path:', schemaPath);
    
//     exec(`npx prisma migrate deploy --schema=${schemaPath}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error('Migration failed:', stderr);
//         reject(error);
//         return;
//       }
//       console.log('Migration output:', stdout);
//       resolve();
//     });
//   });
// }

// async function initializeDatabase() {
//   try {
//     // First connect to the database
//     await global.$connect();
    
//     // Check if the Role table exists
//     try {
//       const result = await global.$queryRaw`SELECT EXISTS (
//         SELECT FROM information_schema.tables 
//         WHERE table_schema = 'public' 
//         AND table_name = 'Role'
//       );`;
      
//       // @ts-ignore
//       const tableExists = result[0]?.exists || false;
      
//       if (!tableExists) {
//         console.log('Role table does not exist, running migrations...');
//         await runMigration();
//       }
//     } catch (error) {
//       console.log('Error checking table existence, attempting migrations...', error);
//       await runMigration();
//     }
    
//     // Now try to create the role (after migrations have run)
//     const roles = [
//       { id: 1, name: 'Super Admin' },
//       { id: 2, name: 'Admin' },
//       { id: 3, name: 'User' }
//     ];

//     for (const role of roles) {
//       await global.role.upsert({
//         where: { id: role.id },
//         update: { 
//           name: role.name,
//           status: 'ACTIVE'
//         },
//         create: {
//           id: role.id,
//           name: role.name,
//           status: 'ACTIVE'
//         }
//       });
      
//     }
    
//     console.log('Database initialized successfully');
//   } catch (error) {
//     console.error('Database initialization failed:', error);
//     throw error;
//   }
// }

// export default initializeDatabase;

import { global } from './db.config';
import { exec } from 'child_process';
import * as path from 'path';
import bcrypt from 'bcryptjs';

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
   
    // Now try to create the roles (after migrations have run)
    const roles = [
      { id: 1, name: 'Super Admin' },
      { id: 2, name: 'Admin' },
      { id: 3, name: 'User' }
    ];

    for (const role of roles) {
      const roleCreated = await global.role.upsert({
        where: { id: role.id },
        update: {
          name: role.name,
          status: 'ACTIVE'
        },
        create: {
          id: role.id,
          name: role.name,
          status: 'ACTIVE'
        }
      });

      // If Super Admin role, create default permissions and user
      if (role.name === 'Super Admin') {
        // Create Super Admin role permissions with all set to true
        await global.rolePermission.upsert({
          where: { roleId: roleCreated.id },
          update: {
            // Paragon group permissions
            paragon_group_view: true,
            paragon_group_create: true,
            paragon_group_edit: true,
            paragon_group_delete: true,

            // Parasole permissions
            parasole_view: true,
            parasole_create: true,
            parasole_edit: true,
            parasole_delete: true,

            // User permissions
            user_view: true,
            user_create: true,
            user_edit: true,
            user_delete: true,

            // Settings permissions
            settings_view: true,
            settings_create: true,
            settings_edit: true,

            dashboard: true,
            analytics_view: true,
          },
          create: {
            roleId: roleCreated.id,
            // Paragon group permissions
            paragon_group_view: true,
            paragon_group_create: true,
            paragon_group_edit: true,
            paragon_group_delete: true,

            // Parasole permissions
            parasole_view: true,
            parasole_create: true,
            parasole_edit: true,
            parasole_delete: true,

            // User permissions
            user_view: true,
            user_create: true,
            user_edit: true,
            user_delete: true,

            // Settings permissions
            settings_view: true,
            settings_create: true,
            settings_edit: true,

            dashboard: true,
            analytics_view: true,
          }
        });

        // Generate a strong default password
        const defaultPassword = 'paragon@';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Check if a Super Admin user already exists
        const existingSuperAdmin = await global.user.findFirst({
          where: { roleId: roleCreated.id }
        });

        if (!existingSuperAdmin) {
          await global.user.create({
            data: {
              firstName: 'Super',
              lastName: 'Admin',
              email: 'superadmin@example.com',
              password: hashedPassword,
              roleId: roleCreated.id,
              status: 'ACTIVE'
            }
          });

          console.log('Default Super Admin user created');
          console.log('Email: superadmin@example.com');
          console.log('Default Password: paragon@');
          console.log('IMPORTANT: Please change the password after first login');
        }
      }
    }
   
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

export default initializeDatabase;