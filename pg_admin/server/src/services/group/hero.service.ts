import { group } from '../../config/db.config';

// Create a new hero
// export const createHero = async (data: any) => {
//     try {
//         return await group.hero.create({
//             data: {
//                 title: data.title,
//                 description: data.description,
//                 companies: data.companies || '',
//                 projects: data.projects || '',
//                 location: data.location || '',
//                 employees: data.employees || '',
//                 industries: data.industries || '',
//                 products: data.products || '',
//                 established: data.established || '',
//                 createdBy: data.createdBy,
//                 updatedBy: "N/A" // No updates have happened yet
//             },
//         });
//     } catch (error) {
//         // console.error("Error creating hero:", error);
//         throw new Error("Failed to create hero.");
//     }
// };

// export const createOrUpdateHero = async (id: number | undefined, data: any) => {
//     try {
//         if (id) {
//             // Update existing hero
//             return await group.hero.update({
//                 where: { id },
//                 data: {
//                     title: data.title,
//                     description: data.description,
//                     companies: data.companies || '',
//                     projects: data.projects || '',
//                     location: data.location || '',
//                     employees: data.employees || '',
//                     industries: data.industries || '',
//                     products: data.products || '',
//                     established: data.established || '',
//                     updatedBy: data.updatedBy,
//                 },
//             });
//         } else {
//             // Create new hero
//             return await group.hero.create({
//                 data: {
//                     title: data.title,
//                     description: data.description,
//                     companies: data.companies || '',
//                     projects: data.projects || '',
//                     location: data.location || '',
//                     employees: data.employees || '',
//                     industries: data.industries || '',
//                     products: data.products || '',
//                     established: data.established || '',
//                     createdBy: data.createdBy,
//                     updatedBy: "N/A"
//                 },
//             });
//         }
//     } catch (error) {
//         console.error("Error saving hero:", error);
//         throw new Error(`Failed to ${id ? 'update' : 'create'} hero.`);
//     }
// };



// Create a new hero
export const createHero = async (data: any) => {
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

// Get all heroes
export const getAllHeroes = async () => {
    try {
        return await group.hero.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching heroes:", error);
        throw new Error("Failed to fetching heroes.");
    }
};
