import { CreateBusinessInput, CreateOperationInput, CreateProductInput, UpdateBusinessInput, UpdateOperationInput, UpdateProductInput } from "../../types/business.types";
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

//Update a business
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

// Delete a business
export const deleteBusiness = async (id: number) => {
    try {
      // Check if business exists and get its current data
      const existingBusiness = await group.business.findUnique({
        where: { id }
      });
      
      if (!existingBusiness) {
        throw new Error('Business not found');
      }
      
      // Delete banner image if it exists
      if (existingBusiness.bannerImage) {
        try {
          const bannerPath = path.resolve(existingBusiness.bannerImage);
          if (fs.existsSync(bannerPath)) {
            fs.unlinkSync(bannerPath);
            console.log(`Deleted banner image: ${bannerPath}`);
          }
        } catch (err) {
          console.error(`Failed to delete banner image: ${existingBusiness.bannerImage}`, err);
          // Continue with deletion even if file deletion fails
        }
      }
      
      // Delete additional image if it exists
      if (existingBusiness.image) {
        try {
          const imagePath = path.resolve(existingBusiness.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete image: ${existingBusiness.image}`, err);
          // Continue with deletion even if file deletion fails
        }
      }
      
      // Delete the business record
      await group.business.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
};




// Create a new business operations
export const createBusinessOperation = async (data: CreateOperationInput) => {
    try {
        return await group.businessOperation.create({
            data: {
                businessId: data.businessId,
                title: data.title,
                description: data.description,
                createdBy: data.createdBy,
                updatedBy: "N/A"
            },
        });
    } catch (error) {
        console.error("Error creating business operation:", error);
        // throw new Error(error instanceof Error ? error.message : "Failed to create business operation.");
        throw new Error("Error creating business operation. Please try again later.");
    }
};

// Get all business operations
export const getAllBusinessOperations = async () => {
    try {
        return await group.businessOperation.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                business: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error getting all business operations:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to get business operations.");
    }
};

// Update business operation
export const updateBusinessOperation = async (id: number, data: UpdateOperationInput) => {
    try {
        return await group.businessOperation.update({
            where: { id },
            data
        });
    } catch (error) {
        console.error("Error updating business operation:", error);
        throw new Error("Error updating business operation. Please try again later.");
    }
};

// Delete business operation
export const deleteBusinessOperation = async (id: number) => {
    try {
        return await group.businessOperation.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting business operation:", error);
        throw new Error("Error deleting business operation. Please try again later.");
    }
};




// Create a new business product
export const createBusinessProduct = async (data: CreateProductInput) => {
    try {
        return await group.businessProduct.create({
            data: {
                businessId: data.businessId,
                title: data.title,
                description: data.description,
                createdBy: data.createdBy,
                updatedBy: "N/A"
            },
        });
    } catch (error) {
        console.error("Error creating business product:", error);
        throw new Error("Error creating business product. Please try again later.");
    }
};

// Get all business products
export const getAllBusinessProducts = async () => {
    try {
        return await group.businessProduct.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                business: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error getting all business products:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to get business products.");
    }
};

// Update business product
export const updateBusinessProduct = async (id: number, data: UpdateProductInput) => {
    try {
        return await group.businessProduct.update({
            where: { id },
            data
        });
    } catch (error) {
        console.error("Error updating business product:", error);
        throw new Error("Error updating business product. Please try again later.");
    }
};

// Delete business product
export const deleteBusinessProduct = async (id: number) => {
    try {
        return await group.businessProduct.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting business product:", error);
        throw new Error("Error deleting business product. Please try again later.");
    }
};
  
