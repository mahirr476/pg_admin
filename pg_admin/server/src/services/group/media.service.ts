import { group } from '../../config/db.config';
import { CreateMediaInput, UpdateMediaInput } from '../../types/media.types';


// Create a new media
export const createMedia = async (data: CreateMediaInput) => {
    try {
      // Check if orderIndex already exists
      const existingMedia = await group.media.findUnique({
        where: { orderIndex: data.orderIndex }
      });
      
      if (existingMedia) {
        throw new Error(`A media entry with order index ${data.orderIndex} already exists`);
      }
      
      // Create the media
      return await group.media.create({
        data: {
          title: data.title,
          orderIndex: data.orderIndex,
          description: data.description,
          createdBy: data.createdBy
        }
      });
    } catch (error) {
      console.error('Error creating media:', error);
      throw error;
    }
};

// Get all media
export const getAllMedia = async () => {
    try {
      return await group.media.findMany({
        orderBy: {
          orderIndex: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching media:', error);
      throw new Error('Failed to fetch media');
    }
};

// Update a media
export const updateMedia = async (id: number, data: UpdateMediaInput) => {
    try {
      // Check if media exists
      const existingMedia = await group.media.findUnique({
        where: { id }
      });
      
      if (!existingMedia) {
        throw new Error(`Media with ID ${id} not found`);
      }
      
      // Check if the new orderIndex conflicts with another entry
      if (data.orderIndex !== undefined && data.orderIndex !== existingMedia.orderIndex) {
        const conflictingMedia = await group.media.findUnique({
          where: { 
            orderIndex: data.orderIndex
          }
        });
        
        if (conflictingMedia && conflictingMedia.id !== id) {
          throw new Error(`A media entry with order index ${data.orderIndex} already exists`);
        }
      }
      
      // Update the media
      return await group.media.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.status !== undefined && { status: data.status }),
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
};

// Delete a media entry
export const deleteMedia = async (id: number) => {
    try {
      // Check if media exists
      const media = await group.media.findUnique({
        where: { id }
      });
      
      if (!media) {
        throw new Error(`Media with ID ${id} not found`);
      }
      
      // Delete the media
      await group.media.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  };