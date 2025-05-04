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
                      image: true,
                      link: true
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
      console.error('Error fetching about with details:', error);
      throw new Error('Failed to fetch about with details');
  }
};