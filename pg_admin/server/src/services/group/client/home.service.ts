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