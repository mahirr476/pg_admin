import { group } from '../../config/db.config';
import { CreateImpactInput, UpdateImpactInput } from '../../types/impact.types';

// Create a new impact
export const createImpact = async (data: CreateImpactInput) => {
    try {
        return await group.impact.create({
            data: {
                title: data.title,
                description: data.description,
                number: data.number,
                createdBy: data.createdBy,
                updatedBy: "N/A"
            },
        });
    } catch (error) {
        console.error("Error creating impact:", error);
        throw new Error("Failed to create impact.");
    }
};

// Update an existing impact
export const updateImpact = async (id: number, data: UpdateImpactInput) => {
    try {
        return await group.impact.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                number: data.number,
                status: data.status,
                updatedBy: data.updatedBy,
                updatedAt: new Date()
            },
        });
    } catch (error) {
        console.error("Error updating impact:", error);
        throw new Error("Failed to update impact.");
    }
};

// Get a specific impact by ID
export const getImpactById = async (id: number) => {
    try {
        const impact = await group.impact.findUnique({
            where: { id }
        });
       
        if (!impact) {
            throw new Error(`Impact with ID ${id} not found`);
        }
       
        return impact;
    } catch (error) {
        console.error("Error fetching impact:", error);
        throw error;
    }
};

// Get all impacts
export const getImpact = async () => {
    try {
        return await group.impact.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching impacts:", error);
        throw new Error("Failed to fetch impacts.");
    }
};

// Delete an impact
export const deleteImpact = async (id: number) => {
    try {
        // Check if impact exists
        const impact = await group.impact.findUnique({
            where: { id }
        });

        if (!impact) {
            throw new Error(`Impact with ID ${id} not found`);
        }

        await group.impact.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting impact:", error);
        throw error;
    }
};