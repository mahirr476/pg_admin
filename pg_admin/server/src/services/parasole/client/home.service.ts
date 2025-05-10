import { parasole } from '../../../config/db.config';

// Get all active heroes
export const getAllActiveHeroes = async () => {
    try {
        return await parasole.hero.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                index: true,
                title: true,
                description: true,
                images: true
            },
            orderBy: { index: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching active heroes:", error);
        throw new Error("Failed to fetch active heroes.");
    }
};

// Get all active hero details
export const getActiveHeroDetails = async () => {
    try {
        return await parasole.heroDetail.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                heroId: true,
                index: true,
                title: true,
                description: true,
                image: true,
            },
            orderBy: { index: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching active hero details:", error);
        throw new Error("Failed to fetch active hero details.");
    }
};

// Get all CSRs with their details
export const getHeroWithDetails = async () => {
  try {
      return await parasole.hero.findMany({
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

