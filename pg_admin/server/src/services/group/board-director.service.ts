import { group } from '../../config/db.config';

// Upsert a board (create or update)
export const upsertBoard = async (data: any) => {
    try {
        // If no title or description, it's an invalid request
        if (!data.title || !data.description) {
            throw new Error("Title and description are required.");
        }

        // Check if board exists by ID if provided
        let existingBoard = null;
        if (data.id) {
            existingBoard = await group.board.findUnique({
                where: { id: data.id }
            });
        }

        // Perform upsert operation
        return await group.board.upsert({
            where: { 
                // If ID exists and board exists, use it for update
                // Otherwise, create a new board
                id: existingBoard ? data.id : 0 
            },
            update: {
                title: data.title,
                description: data.description,
                updatedBy: data.updatedBy
            },
            create: {
                title: data.title,
                description: data.description,
                createdBy: data.createdBy,
                updatedBy: "N/A"
            }
        });
    } catch (error) {
        // console.error("Error upserting board:", error);
        throw new Error("Failed to upsert board.");
    }
};

// Get all boards
export const getAllBoards = async () => {
    try {
        return await group.board.findFirst();
    } catch (error) {
        // console.error("Error fetching boards:", error);
        throw new Error("Failed to fetch boards.");
    }
};

// Get a specific board by ID
// export const getBoardById = async (id: number) => {
//     try {
//         return await group.board.findUnique({
//             where: { id }
//         });
//     } catch (error) {
//         console.error("Error fetching board:", error);
//         throw new Error("Failed to fetch board.");
//     }
// };