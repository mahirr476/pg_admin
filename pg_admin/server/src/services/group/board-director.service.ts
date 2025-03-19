import { group } from '../../config/db.config';

// Create or update board information
export const upsertBoard = async (data: any) => {
    try {
        // Check if board record already exists
        const existingBoard = await group.board.findFirst();
       
        if (existingBoard) {
            // Update existing record
            return await group.board.update({
                where: { id: existingBoard.id },
                data: {
                    title: data.title,
                    description: data.description,
                    updatedBy: data.updatedBy,
                },
            });
        } else {
            // Create new record
            return await group.board.create({
                data: {
                    title: data.title,
                    description: data.description,
                    createdBy: data.createdBy,
                    updatedBy: "N/A"
                },
            });
        }
    } catch (error) {
        console.error("Error saving board information:", error);
        throw new Error("Failed to save board information.");
    }
};

// Get all boards information
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


export const createBoardDirector = async (data: any) => {
    try {
      // Parse the orderIndex to ensure it's a number
      const orderIndex = data.orderIndex ? parseInt(data.orderIndex, 10) : null;
      
      // Check if this specific orderIndex is valid
      if (orderIndex !== null) {
        // Check if the orderIndex already exists
        const existingDirector = await group.boardOfDirector.findUnique({
          where: {
            orderIndex: orderIndex
          }
        });
        
        if (existingDirector) {
          throw new Error(`A director with order index ${orderIndex} already exists. Please use a different order index.`);
        }
      } else {
        // If no orderIndex was provided, throw an error since it's a required field
        throw new Error('Order index is required. Please provide a unique order index.');
      }
      
      return await group.boardOfDirector.create({
        data: {
          name: data.name,
          designation: data.designation,
          orderIndex: orderIndex,
          image: data.image || 'default-director.jpg',
          shortDescription: data.shortDescription,
          longDescription: data.longDescription,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy
        }
      });
    } catch (error) {
      console.error('Error creating board director:', error);
      throw error; // Re-throw the original error to preserve the message
    }
  };

export const getAllBoardDirectors = async () => {
    try {
      return await group.boardOfDirector.findMany({
        orderBy: {
          orderIndex: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching board directors:', error);
      throw new Error('Failed to fetch board directors');
    }
};
  