import fs from 'fs';
import path from 'path';
import { generateSlug } from '../../util/slugGenerator';
import { group } from '../../config/db.config';
import { CreateGalleryInput, CreateMediaInput, CreateNewsInput, MediaContactInput, MediaInqueryData, UpdateGalleryInput, UpdateMediaInput, UpdateNewsInput } from '../../types/media.types';


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



// =========================== MEDIA GALLERY SERVICES ===========================


// Create a new gallery
export const createGallery = async (data: CreateGalleryInput) => {
    try {
      // Generate slug from title
      const slug = generateSlug(data.title);
      
      // Check if slug already exists
      const existingGallery = await group.mediaGallery.findUnique({
        where: { slug }
      });
      
      if (existingGallery) {
        throw new Error(`A media gallery with the title "${data.title}" already exists`);
      }
      
      // Create the media gallery
      return await group.mediaGallery.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          image: data.image,
          link: data.link,
          createdBy: data.createdBy
        }
      });
    } catch (error) {
      console.error('Error creating media gallery:', error);
      throw error;
    }
};

// Get all galleries
export const getAllGalleries = async () => {
    try {
      return await group.mediaGallery.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching media galleries:', error);
      throw new Error('Failed to fetch media galleries');
    }
};

// Update a gallery
export const updateMediaGallery = async (id: number, data: UpdateGalleryInput) => {
    try {
      // Check if media gallery exists
      const existingGallery = await group.mediaGallery.findUnique({
        where: { id }
      });
      
      if (!existingGallery) {
        throw new Error(`Media gallery with ID ${id} not found`);
      }
      
      // Generate new slug if title is being updated
      let slug;
      if (data.title && data.title !== existingGallery.title) {
        slug = generateSlug(data.title);
        
        // Check if the slug is already in use by another gallery
        const conflictingGallery = await group.mediaGallery.findFirst({
          where: {
            slug,
            id: { not: id }
          }
        });
        
        if (conflictingGallery) {
          throw new Error(`A media gallery with the title "${data.title}" already exists`);
        }
      }
      
      // Handle image cleanup if a new one is being uploaded
      if (data.image && data.image !== existingGallery.image) {
        try {
          // Delete the old image
          if (existingGallery.image) {
            const oldImagePath = path.resolve(existingGallery.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old gallery image: ${oldImagePath}`);
            }
          }
        } catch (err) {
          console.error(`Failed to delete old gallery image: ${existingGallery.image}`, err);
          // Continue with update even if file deletion fails
        }
      }
      
      // Update the media gallery
      return await group.mediaGallery.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(slug && { slug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.link !== undefined && { link: data.link }),
          ...(data.status !== undefined && { status: data.status }),
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating media gallery:', error);
      throw error;
    }
};

// Delete a media gallery
export const deleteGallery = async (id: number) => {
    try {
      // Check if media gallery exists
      const gallery = await group.mediaGallery.findUnique({
        where: { id }
      });
      
      if (!gallery) {
        throw new Error(`Media gallery with ID ${id} not found`);
      }
      
      // Delete the image file if it exists
      if (gallery.image) {
        try {
          const imagePath = path.resolve(gallery.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted gallery image: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete gallery image: ${gallery.image}`, err);
          // Continue with deletion even if file deletion fails
        }
      }
      
      // Delete the media gallery
      await group.mediaGallery.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting media gallery:', error);
      throw error;
    }
};


// =========================== MEDIA NEWS SERVICES ===========================

// Create a new media news
export const createNews = async (data: CreateNewsInput) => {
    try {
      // Generate slug from title
      const slug = generateSlug(data.title);
      
      // Check if slug already exists
      const existingNews = await group.mediaNews.findUnique({
        where: { slug }
      });
      
      if (existingNews) {
        throw new Error(`A media news with the title "${data.title}" already exists`);
      }
      
      // Create the media news
      return await group.mediaNews.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          image: data.image,
          link: data.link,
          tag: data.tag,
          date: data.date,
          createdBy: data.createdBy
        }
      });
    } catch (error) {
      console.error('Error creating media news:', error);
      throw error;
    }
};

// Get all media news
export const getAllNews = async () => {
    try {
      return await group.mediaNews.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching media news:', error);
      throw new Error('Failed to fetch media news');
    }
};
  
// Update a media news
export const updateNews = async (id: number, data: UpdateNewsInput) => {
    try {
      // Check if media news exists
      const existingNews = await group.mediaNews.findUnique({
        where: { id }
      });
      
      if (!existingNews) {
        throw new Error(`Media news with ID ${id} not found`);
      }
      
      // Generate new slug if title is being updated
      let slug;
      if (data.title && data.title !== existingNews.title) {
        slug = generateSlug(data.title);
        
        // Check if the slug is already in use by another news
        const conflictingNews = await group.mediaNews.findFirst({
          where: {
            slug,
            id: { not: id }
          }
        });
        
        if (conflictingNews) {
          throw new Error(`A media news with the title "${data.title}" already exists`);
        }
      }
      
      // Handle image cleanup if a new one is being uploaded
      if (data.image && data.image !== existingNews.image) {
        try {
          // Delete the old image
          if (existingNews.image) {
            const oldImagePath = path.resolve(existingNews.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old news image: ${oldImagePath}`);
            }
          }
        } catch (err) {
          console.error(`Failed to delete old news image: ${existingNews.image}`, err);
          // Continue with update even if file deletion fails
        }
      }
      
      // Update the media news
      return await group.mediaNews.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(slug && { slug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.link !== undefined && { link: data.link }),
          ...(data.tag !== undefined && { tag: data.tag }),
          ...(data.date !== undefined && { date: data.date }),
          ...(data.status !== undefined && { status: data.status }),
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating media news:', error);
      throw error;
    }
};

// Delete a media news
export const deleteNews = async (id: number) => {
    try {
      // Check if media news exists
      const news = await group.mediaNews.findUnique({
        where: { id }
      });
      
      if (!news) {
        throw new Error(`Media news with ID ${id} not found`);
      }
      
      // Delete the image file if it exists
      if (news.image) {
        try {
          const imagePath = path.resolve(news.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted news image: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete news image: ${news.image}`, err);
          // Continue with deletion even if file deletion fails
        }
      }
      
      // Delete the media news
      await group.mediaNews.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting media news:', error);
      throw error;
    }
};


// =========================== MEDIA INQUERY SERVICES ===========================


export const getMediaInquery = async () => {
    try {
      // Just get the first record (there should only be one)
      return await group.mediaInquery.findFirst();
    } catch (error) {
      console.error('Error fetching media inquiry:', error);
      throw error;
    }
};
  
export const upsertMediaInquery = async (data: MediaInqueryData, userName: string) => {
    try {
      // Get the existing record (if any)
      const existingInquery = await getMediaInquery();
      
      if (!existingInquery) {
        // Create new record if none exists
        return await group.mediaInquery.create({
          data: {
            title: data.title,
            description: data.description,
            email: data.email,
            contactNo: data.contactNo,
            website: data.website,
            createdBy: userName
          }
        });
      }
      
      // Update existing record
      return await group.mediaInquery.update({
        where: { id: existingInquery.id },
        data: {
          title: data.title,
          description: data.description,
          email: data.email,
          contactNo: data.contactNo,
          website: data.website,
          updatedBy: userName,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error upserting media inquiry:', error);
      throw error;
    }
};




// =========================== MEDIA Contact Form SERVICES ===========================

// Get all media contacts
export const getAllMediaContacts = async () => {
    try {
      return await group.mediaContact.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching media contacts:', error);
      throw new Error('Failed to fetch media contacts');
    }
};

// Delete a media contact
export const deleteMediaContact = async (id: number) => {
    try {
      // Check if media contact exists
      const contact = await group.mediaContact.findUnique({
        where: { id }
      });
      
      if (!contact) {
        throw new Error(`Media contact with ID ${id} not found`);
      }
      
      // Delete the media contact
      await group.mediaContact.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting media contact:', error);
      throw error;
    }
};