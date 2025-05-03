import { parasole } from '../../../config/db.config';

// Get all CSRs with their details
export const getComplianceWithDetails = async () => {
  try {
      return await parasole.compliance.findMany({
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
                      image: true,
                      description: true,
                      shortDescrip: true
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
      console.error('Error fetching compliance with details:', error);
      throw new Error('Failed to fetch compliance with details');
  }
};