import { group } from '../../config/db.config';
import { CreateHeroInput, UpdateHeroInput } from '../../types/hero.types';

// Create a new hero
export const createHero = async (data: CreateHeroInput) => {
    try {
        return await group.hero.create({
            data: {
                title: data.title,
                description: data.description,
                index: data.index,
                createdBy: data.createdBy,
                updatedBy: "N/A"
            },
        });
    } catch (error) {
        console.error("Error creating hero:", error);
        throw new Error("Failed to create hero.");
    }
};

// Update an existing hero
export const updateHero = async (id: number, data: UpdateHeroInput) => {
    try {
        return await group.hero.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.index !== undefined && { index: data.index }),
                ...(data.status !== undefined && { status: data.status }),
                updatedBy: data.updatedBy,
                updatedAt: new Date()
            },
        });
    } catch (error) {
        console.error("Error updating hero:", error);
        throw new Error("Failed to update hero.");
    }
};

// Get a specific hero by ID
export const getHeroById = async (id: number) => {
    try {
        const hero = await group.hero.findUnique({
            where: { id }
        });
        
        if (!hero) {
            throw new Error(`Hero with ID ${id} not found`);
        }
        
        return hero;
    } catch (error) {
        console.error("Error fetching hero:", error);
        throw error;
    }
};

// Get all heroes
export const getAllHeroes = async () => {
    try {
        return await group.hero.findMany({
            orderBy: {
                index: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching heroes:", error);
        throw new Error("Failed to fetch heroes.");
    }
};

// Delete a hero
export const deleteHero = async (id: number) => {
    try {
        // Check if hero exists
        const hero = await group.hero.findUnique({
            where: { id }
        });

        if (!hero) {
            throw new Error(`Hero with ID ${id} not found`);
        }

        await group.hero.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting hero:", error);
        throw error;
    }
};
