import { parasole } from '../../../config/db.config';

// Get all CSRs with their details
export const getContactWithDetails = async () => {
  try {
      return await parasole.about.findMany({
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
                      image: true
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
      console.error('Error fetching hero with details:', error);
      throw new Error('Failed to fetch hero with details');
  }
};