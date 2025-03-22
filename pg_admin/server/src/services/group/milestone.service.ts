import { CreateMilestoneInput, UpdateMilestoneInput } from '../../types/milestone.types';
import { group } from '../../config/db.config';


// Create a new milestone
export const createMilestone = async (data: CreateMilestoneInput) => {
    try {
      // Check if order index already exists
      const existingMilestone = await group.milestone.findUnique({
        where: { orderIndex: data.orderIndex }
      });
      
      if (existingMilestone) {
        throw new Error(`A milestone with order index ${data.orderIndex} already exists`);
      }
      
      return await group.milestone.create({
        data: {
          title: data.title,
          description: data.description,
          orderIndex: data.orderIndex,
          createdBy: data.createdBy,
          updatedBy: "N/A"
        }
      });
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
};

// Get all milestones
export const getAllMilestones = async () => {
    try {
      return await group.milestone.findMany({
        orderBy: {
          orderIndex: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw new Error('Failed to fetch milestones');
    }
};

// Get milestone by ID
// export const getMilestoneById = async (id: number) => {
//     try {
//       const milestone = await group.milestone.findUnique({
//         where: { id }
//       });
      
//       if (!milestone) {
//         throw new Error(`Milestone with ID ${id} not found`);
//       }
      
//       return milestone;
//     } catch (error) {
//       console.error(`Error fetching milestone with ID ${id}:`, error);
//       throw error;
//     }
// };

// Update a milestone
export const updateMilestone = async (id: number, data: UpdateMilestoneInput) => {
    try {
      // Check if milestone exists
      const existingMilestone = await group.milestone.findUnique({
        where: { id }
      });
      
      if (!existingMilestone) {
        throw new Error(`Milestone with ID ${id} not found`);
      }
      
      // If updating orderIndex, check if the new orderIndex already exists
      if (data.orderIndex && data.orderIndex !== existingMilestone.orderIndex) {
        const milestoneWithSameOrderIndex = await group.milestone.findUnique({
          where: { orderIndex: data.orderIndex }
        });
        
        if (milestoneWithSameOrderIndex) {
          throw new Error(`A milestone with order index ${data.orderIndex} already exists`);
        }
      }
      
      return await group.milestone.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          orderIndex: data.orderIndex,
          status: data.status,
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error(`Error updating milestone with ID ${id}:`, error);
      throw error;
    }
};

// Delete a milestone
export const deleteMilestone = async (id: number) => {
    try {
      // Check if milestone exists
      const existingMilestone = await group.milestone.findUnique({
        where: { id }
      });
      
      if (!existingMilestone) {
        throw new Error(`Milestone with ID ${id} not found`);
      }
      
      return await group.milestone.delete({
        where: { id }
      });
    } catch (error) {
      console.error(`Error deleting milestone with ID ${id}:`, error);
      throw error;
    }
  };
  