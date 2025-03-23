import { CreateMilestoneInput, UpdateMilestoneInput } from '../../types/milestone.types';
import { CreateMilestoneDetailInput, UpdateMilestoneDetailInput } from '../../types/milestoneDetail.types';
import { group } from '../../config/db.config';
import fs from 'fs';
import path from 'path';


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

// Create a new milestone detail
export const createMileDetail = async (data: CreateMilestoneDetailInput) => {
    try {
      return await group.milestoneDetail.create({
        data: {
          year: data.year,
          title: data.title,
          description: data.description,
          image: data.image,
          createdBy: data.createdBy,
          updatedBy: "N/A"
        }
      });
    } catch (error) {
      console.error('Error creating milestone detail:', error);
      throw error;
    }
};

// Get all milestone details
export const getAllMilestoneDetails = async () => {
    try {
      return await group.milestoneDetail.findMany({
        orderBy: {
          year: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching milestone details:', error);
      throw new Error('Failed to fetch milestone details');
    }
};


// update Milestone detail
export const updateMilestoneDetail = async (id: number, data: any) => {
    try {
      // First check if the detail exists
      const existingDetail = await group.milestoneDetail.findUnique({
        where: { id }
      });
  
      if (!existingDetail) {
        throw new Error(`Milestone detail with ID ${id} not found`);
      }
  
      // Prepare update data
      const updateData: any = {};
      
      // Only update fields that are provided and not undefined
      if (data.year !== undefined) updateData.year = data.year;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.updatedBy) updateData.updatedBy = data.updatedBy;
      
      // Handle image update
      if (data.image !== undefined) {
        // If a new image is provided, check if we need to delete the old one
        if (data.image && existingDetail.image && data.image !== existingDetail.image) {
          try {
            // Delete the old image file
            const oldImagePath = path.resolve(existingDetail.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          } catch (err) {
            console.error(`Failed to delete old image file: ${existingDetail.image}`, err);
            // Continue with update even if deleting old file fails
          }
        }
        
        // Set the new image path (or null if image was removed)
        updateData.image = data.image;
      }
      
      // Update the record
      const updatedDetail = await group.milestoneDetail.update({
        where: { id },
        data: updateData
      });
      
      return updatedDetail;
    } catch (error) {
      console.error(`Error updating milestone detail with ID ${id}:`, error);
      throw error;
    }
};


//delete Milestone detail
export const deleteMilestoneDetail = async (id: number) => {
    try {
      // First check if the detail exists and get its data (including image path)
      const existingDetail = await group.milestoneDetail.findUnique({
        where: { id }
      });
  
      if (!existingDetail) {
        throw new Error(`Milestone detail with ID ${id} not found`);
      }
  
      // Delete the associated image file if it exists
      if (existingDetail.image) {
        try {
          const imagePath = path.resolve(existingDetail.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Successfully deleted image file: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete image file: ${existingDetail.image}`, err);
          // Continue with deletion even if file removal fails
        }
      }
  
      // Delete the database record
      await group.milestoneDetail.delete({
        where: { id }
      });
  
      return true;
    } catch (error) {
      console.error(`Error deleting milestone detail with ID ${id}:`, error);
      throw error;
    }
  };

// Update a milestone detail
// export const updateMilestoneDetail = async (id: number, data: UpdateMilestoneDetailInput) => {
//     try {
//       // Check if milestone detail exists
//       const existingMilestoneDetail = await group.milestoneDetail.findUnique({
//         where: { id }
//       });
      
//       if (!existingMilestoneDetail) {
//         throw new Error(`Milestone detail with ID ${id} not found`);
//       }
//       // If image is being updated, delete the old one
//       if (data.image && existingMilestoneDetail.image !== data.image) {
//         await deleteFile(existingMilestoneDetail.image);
//       }
//       }
      
//       // Create update data object
//       const updateData: any = {};
      
//       // Only include fields that are provided
//       if (data.year !== undefined) updateData.year = data.year;
//       if (data.title !== undefined) updateData.title = data.title;
//       if (data.description !== undefined) updateData.description = data.description;
//       if (data.image !== undefined) updateData.image = data.image;
//       if (data.status !== undefined) updateData.status = data.status;
      
//       // Always include updatedBy and set updatedAt
//       updateData.updatedBy = data.updatedBy;
//       updateData.updatedAt = new Date();
      
//       return await group.milestoneDetail.update({
//         where: { id },
//         data: updateData
//       });
//     } catch (error) {
//       console.error(`Error updating milestone detail with ID ${id}:`, error);
//       throw error;
//     }
//   };
  
  