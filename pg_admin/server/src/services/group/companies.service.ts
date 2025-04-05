import fs from 'fs';
import path from 'path';
import { group } from '../../config/db.config';
import { generateSlug } from "../../util/slugGenerator";
import { CreateCompanyInput, UpdateCompanyInput } from '../../types/company.types';


export const createCompany = async (data: CreateCompanyInput) => {
    try {
        // Generate slug from title
        const slug = generateSlug(data.title);

        // Check if slug already exists
        const existingCompany  = await group.companies.findUnique({
            where: { slug }
        });

        if (existingCompany) {
            throw new Error(`A company with this title "${slug}" already exists`);
        }

        // Create company
        return await group.companies.create({
            data: {
                title: data.title,
                slug,
                image: data.image,
                shortDes: data.shortDes,
                longDes: data.longDes,
                founded: data.founded,
                teamSize: data.teamSize,
                location: data.location,
                category: data.category,
                globalPresence: data.globalPresence,
                revenue: data.revenue,
                clientSatisfaction: data.clientSatisfaction,
                createdBy: data.createdBy
            }
        });

    } catch (error) {
        console.error('Error in createCompany service:', error);
        throw error;
    }
};

// Get all companies
export const getAllCompanies = async () => {
    try {
      return await group.companies.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw new Error('Failed to fetch companies');
    }
};

// Get a company by ID
export const getCompanyById = async (id: number) => {
    try {
      const company = await group.companies.findUnique({
        where: { id }
      });
      
      if (!company) {
        throw new Error(`Company with ID ${id} not found`);
      }
      
      return company;
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      throw error;
    }
};

// Update a company
export const updateCompany = async (id: number, data: UpdateCompanyInput) => {
    try {
      // Check if company exists
      const existingCompany = await group.companies.findUnique({
        where: { id }
      });
      
      if (!existingCompany) {
        throw new Error(`Company with ID ${id} not found`);
      }
      
      // Generate new slug if title is being updated
      let slug;
      if (data.title && data.title !== existingCompany.title) {
        slug = generateSlug(data.title);
        
        // Check if the slug is already in use by another company
        const conflictingCompany = await group.companies.findFirst({
          where: {
            slug,
            id: { not: id }
          }
        });
        
        if (conflictingCompany) {
          throw new Error(`A company with the title "${data.title}" already exists.`);
        }
      }
      
      // Handle image cleanup if a new one is being uploaded
      if (data.image && data.image !== existingCompany.image) {
        try {
          // Delete the old image
          if (existingCompany.image) {
            const oldImagePath = path.resolve(existingCompany.image);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
              console.log(`Deleted old image: ${oldImagePath}`);
            }
          }
        } catch (err) {
          console.error(`Failed to delete old image: ${existingCompany.image}`, err);
          // Continue with update even if file deletion fails
        }
      }
      
      // Update the company
      return await group.companies.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title }),
          ...(slug && { slug }),
          ...(data.image && { image: data.image }),
          ...(data.shortDes && { shortDes: data.shortDes }),
          ...(data.longDes && { longDes: data.longDes }),
          ...(data.founded && { founded: data.founded }),
          ...(data.teamSize && { teamSize: data.teamSize }),
          ...(data.location && { location: data.location }),
          ...(data.category && { category: data.category }),
          ...(data.globalPresence && { globalPresence: data.globalPresence }),
          ...(data.revenue && { revenue: data.revenue }),
          ...(data.clientSatisfaction && { clientSatisfaction: data.clientSatisfaction }),
          ...(data.status && { status: data.status }),
          updatedBy: data.updatedBy,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
};

// Delete a company
export const deleteCompany = async (id: number) => {
    try {
      // Check if company exists
      const company = await group.companies.findUnique({
        where: { id }
      });
      
      if (!company) {
        throw new Error(`Company with ID ${id} not found`);
      }
      
      // Delete the image file if it exists
      if (company.image) {
        try {
          const imagePath = path.resolve(company.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image: ${imagePath}`);
          }
        } catch (err) {
          console.error(`Failed to delete image: ${company.image}`, err);
          // Continue with deletion even if file deletion fails
        }
      }
      
      // Delete the company
      await group.companies.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
};


  