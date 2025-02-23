// src/config/init.db.ts
import prisma from './db.config';

async function initializeDatabase() {
  try {
    await prisma.$connect();
    
    // Create default role if it doesn't exist
    await prisma.role.upsert({
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