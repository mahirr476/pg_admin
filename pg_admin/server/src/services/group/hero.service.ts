import { group } from '../../config/db.config';

// Create a new hero
export const createHero = async (data: any) => {
    try {
        return await group.hero.create({
            data: {
                title: data.title,
                description: data.description,
                companies: data.companies || '',
                projects: data.projects || '',
                location: data.location || '',
                employees: data.employees || '',
                industries: data.industries || '',
                products: data.products || '',
                established: data.established || '',
                createdBy: data.createdBy,
                updatedBy: "N/A" // No updates have happened yet
            },
        });
    } catch (error) {
        // console.error("Error creating hero:", error);
        throw new Error("Failed to create hero.");
    }
};