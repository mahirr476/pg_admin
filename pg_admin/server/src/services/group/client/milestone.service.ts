import { group } from '../../../config/db.config';

export const getMilestoneContent = async () => {
    try {
        return await group.milestone.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                orderIndex: true,
                title: true,
                description: true,
            },
            orderBy: {
                orderIndex: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching milestones Content:", error);
        throw new Error("Failed to fetch milestones Content.");
    }
}

export const getActiveMilestone = async () => {
    try {
        return await group.milestoneDetail.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                year: true,
                title: true,
                description: true,
                image: true,
            },
            orderBy: {
                year: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching milestones:", error);
        throw new Error("Failed to fetch milestones.");
    }
}