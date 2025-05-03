import { parasole } from '../../../config/db.config';

// Get all operation with their details
export const getOperationWithDetails = async () => {
  try {
      return await parasole.operation.findMany({
          where: {
              status: 'ACTIVE',
          },
          select: {
              id: true,
              index: true,
              title: true,
              description: true,
              images: true,
              detail: {  
                  where: {
                      status: 'ACTIVE'
                  },
                  select: {
                      id: true,
                      index: true,
                      title: true,
                      description: true
                  },
                  orderBy: {
                    index: 'asc',
                  },
              }
          },
          orderBy: {
            index: 'asc',
          },
      });
  } catch (error) {
      console.error('Error fetching Operation with details:', error);
      throw new Error('Failed to fetch Operation with details');
  }
};