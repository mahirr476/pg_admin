import { group } from '../../config/db.config';

// Upsert impact (create if not exists, otherwise update)
// export const upsertImpact = async (data: any) => {
//     try {
//         // Check if an impact record already exists
//         const existingImpact = await group.impact.findFirst();
        
//         if (existingImpact) {
//             // Update the existing record
//             return await group.impact.update({
//                 where: { id: existingImpact.id },
//                 data: {
//                     title: data.title,
//                     description: data.description,
//                     updatedBy: data.updatedBy,
//                     // Don't update createdBy field
//                 },
//             });
//         } else {
//             // Create a new impact record if none exists
//             return await group.impact.create({
//                 data: {
//                     title: data.title,
//                     description: data.description,
//                     createdBy: data.createdBy,
//                     updatedBy: "N/A" // Indicate no updates have happened yet
//                 },
//             });
//         }
//     } catch (error) {
//         console.error("Error upserting impact:", error);
//         throw new Error("Failed to save impact.");
//     }
// };



// Create a new impact
export const createImpact = async (data: any) => {
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

// Get the impact record
export const getImpact = async () => {
    try {
        // Get the impact record (should be only one)
        const impact = await group.impact.findFirst();
        
        return impact;
    } catch (error) {
        console.error("Error fetching impact:", error);
        throw new Error("Failed to fetch impact.");
    }
};