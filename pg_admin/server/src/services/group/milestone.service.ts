import { CreateMilestoneInput } from '../../types/milestone.types';
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
