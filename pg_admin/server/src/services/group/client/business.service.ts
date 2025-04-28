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
                slug,
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
                id,
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

export const getBusinessOperationsByBusinessId = async (businessId: number) => {
    try {
        return await group.businessOperation.findMany({
            where: {
                businessId,
                status: 'ACTIVE'
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
            orderBy: {
                id: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching business operations:", error);
        throw new Error("Failed to fetch business operations.");
    }
};

export const getBusinessProductsByBusinessId = async (businessId: number) => {
    try {
        return await group.businessProduct.findMany({
            where: {
                businessId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
        });
    } catch (error) {
        console.error("Error fetching business products:", error);
        throw new Error("Failed to fetch business products.");
    }
};


export const getBusinessUnitsByBusinessId = async (businessId: number) => {
    try {
        return await group.businessUnit.findMany({
            where: {
                businessId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                title: true,
                description: true,
            },
        });
    } catch (error) {
        console.error("Error fetching business units:", error);
        throw new Error("Failed to fetch business units.");
    }
};

export const getBusinessCertificationsByBusinessId = async (businessId: number) => {
    try {
        return await group.businessCertification.findMany({
            where: {
                businessId,
                status: 'ACTIVE',
            },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
            },
        });
    } catch (error) {
        console.error("Error fetching business certifications:", error);
        throw new Error("Failed to fetch business certifications.");
    }
};