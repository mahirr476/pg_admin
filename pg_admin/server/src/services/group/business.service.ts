import { CreateBusinessInput, UpdateBusinessInput } from "../../types/business.types";
import { group } from '../../config/db.config';
import { generateSlug } from "../../util/slugGenerator";
import fs from 'fs';
import path from 'path';

// Create a new business
export const createBusiness = async (data: CreateBusinessInput) => {
    try {
      // Generate slug from title
      const slug = generateSlug(data.title);
      
      // Check if slug already exists
      const existingBusiness = await group.business.findUnique({
        where: { slug }
      });
      
      // If slug exists, throw an error instead of appending a number
      if (existingBusiness) {
        throw new Error(`A business with the title "${data.title}" already exists. Please use a different title.`);
      }
      
      return await group.business.create({
        data: {
          title: data.title,
          bannerImage: data.bannerImage,
          slug: slug,
          shortDes: data.shortDes,
          longDes: data.longDes,
          videoLink: data.videoLink,
          image: data.image,
          createdBy: data.createdBy,
          updatedBy: "N/A"
        }
      });
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
};

// Get all businesses
export const getAllBusinesses = async () => {
    try {
      return await group.business.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw new Error('Failed to fetch businesses');
    }
};


// Get a business by ID
export const getBusinessById = async (id: number) => {
    try {
      return await group.business.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching business by ID:', error);
      throw new Error('Failed to fetch business');
    }
  };
  
  export const updateBusiness = async (id: number, data: UpdateBusinessInput) => {
    try {
      // Check if business exists and get its current data
      const existingBusiness = await group.business.findUnique({
        where: { id }
      });
      
      if (!existingBusiness) {
        throw new Error('Business not found');
      }
      
      // Generate new slug if title is being updated
      let slug;
      if (data.title && data.title !== existingBusiness.title) {
        slug = generateSlug(data.title);
        
        // Check if the slug is already in use by another business
        const conflictingBusiness = await group.business.findFirst({
          where: {
            slug,
            id: { not: id }
          }
        });
        
        if (conflictingBusiness) {
          throw new Error(`A business with the title "${data.title}" already exists.`);
        }
      }
  
      // Handle banner image cleanup if a new one is being uploaded
      if (data.bannerImage && data.bannerImage !== existingBusiness.bannerImage) {
        try {
          // Delete the old banner image
          if (existingBusiness.bannerImage) {
            const oldBannerPath = path.resolve(existingBusiness.bannerImage);
            if (fs.existsSync(oldBannerPath)) {
              fs.unlinkSync(oldBannerPath);
              console.log(`Deleted old banner image: ${oldBannerPath}`);
            }
          }
        } catch (err) {
          console.error(`Failed to delete old banner image: ${existingBusiness.bannerImage}`, err);
          // Continue with update even if file deletion fails
        }
      }
  
      // Handle additional image cleanup if a new one is being uploaded
      if (data.image && data.image !== existingBusiness.image) {
        try {
          // Delete the old image
          if (existingBusiness.image) {
            const oldImagePath = path.resolve(existingBusiness.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old image: ${oldImagePath}`);
            }
          }
        } catch (err) {
          console.error(`Failed to delete old image: ${existingBusiness.image}`, err);
          // Continue with update even if file deletion fails
        }
      }
      
      // Update the business
      return await group.business.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.shortDes && { shortDes: data.shortDes }),
          ...(data.longDes && { longDes: data.longDes }),
          ...(data.videoLink !== undefined && { videoLink: data.videoLink }),
          ...(data.image !== undefined && { image: data.image }),
          ...(data.bannerImage !== undefined && { bannerImage: data.bannerImage }),
          ...(data.status && { status: data.status }),
          ...(slug && { slug }),
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };
  
