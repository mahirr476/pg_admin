import { parasole } from '../../../config/db.config';

// Get all operation with their details
export const getbuyerWithDetails = async () => {
  try {
      return await parasole.buyer.findMany({
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
                      description: true,
                      image: true,
                      type: true,
                      year: true
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
      console.error('Error fetching buyer with details:', error);
      throw new Error('Failed to fetch buyer with details');
  }
};