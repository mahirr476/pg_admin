import { group } from '../../../config/db.config';

export const getCompanies = async () => {
    try {
        return await group.companies.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                title: true,
                shortDes: true,
                slug: true,
            },
            orderBy: {
                id: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw new Error("Failed to fetch companies.");
    }
};

export const getCompaniesBySlug = async (slug: string) => {
    try {
        return await group.companies.findFirst({
            where: {
                slug,
                status: 'ACTIVE'
            },
            select: {
                id: true,
                title: true,
                shortDes: true,
                longDes: true,
                image: true,
                founded: true,
                teamSize: true,
                location: true,
                category: true,
                globalPresence: true,
                revenue: true,
                clientSatisfaction: true,
            },
        });
    } catch (error) {
        console.error("Error fetching Companies details:", error);
        throw new Error("Failed to fetch Companies details.");
    }
};