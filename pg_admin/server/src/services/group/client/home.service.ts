import { group } from '../../../config/db.config';

// Get all active heroes
export const getAllActiveHeroes = async () => {
    try {
        return await group.hero.findMany({
            where: {
                status: 'ACTIVE' // Filter only active heroes
            },
            select: {
                id: true,
                index: true,
                title: true,
                description: true
            },
            orderBy: {
                index: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching active heroes:", error);
        throw new Error("Failed to fetch active heroes.");
    }
};

// Get all active impacts
export const getActiveImpacts = async () => {
    try {
        return await group.impact.findMany({
            where: {
                status: 'ACTIVE' // Filter only active impacts
            },
            select: {
                id: true,
                title: true,
                number: true,
                description: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching active impacts:", error);
        throw new Error("Failed to fetch active impacts.");
    }
};

// Get all active businesses
export const getAllBusinesses = async () => {
    try {
      return await group.business.findMany({
        where: {
            status: 'ACTIVE'
        },
        select: {
            id: true,
            title: true,
            bannerImage: true,
            shortDes: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch businesses');
    }
};

// Get all active media news
export const getAllNews = async () => {
    try {
      return await group.mediaNews.findMany({
        where: {
            status: 'ACTIVE'
        },
        select: {
            id: true,
            title: true,
            description: true,
            image: true,
            link: true,
            tag: true,
            date: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching media news:', error);
      throw new Error('Failed to fetch media news');
    }
};