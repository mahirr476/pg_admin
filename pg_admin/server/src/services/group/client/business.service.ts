import { group } from '../../../config/db.config';

export const getBusiness = async () => {
    try {
        return await group.business.findMany({
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
        console.error("Error fetching business:", error);
        throw new Error("Failed to fetch business.");
    }
};

export const getBusinessBySlug = async (slug: string) => {
    try {
        return await group.business.findFirst({
            where: {
                slug: slug,
                status: 'ACTIVE'
            },
            select: {
                id: true,
                title: true,
                shortDes: true,
                longDes: true,
                bannerImage: true,
                image: true,
                videoLink: true,
            },
        });
    } catch (error) {
        console.error("Error fetching business details:", error);
        throw new Error("Failed to fetch business details.");
    }
};


export const getBusinessById = async (id: number) => {
    try {
        return await group.business.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                shortDes: true,
                longDes: true,
                bannerImage: true,
                image: true,
                videoLink: true,
                slug: true,
            },
        });
    } catch (error) {
        console.error("Error fetching business details:", error);
        throw new Error("Failed to fetch business details.");
    }
};