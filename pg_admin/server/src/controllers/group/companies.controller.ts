// controllers/group/companies.controller.ts
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { formatDate } from "../../util/dateFormatter";
import { uploadCompanyFiles, UPLOAD_PATHS } from "../../middleware/upload.middleware";
import { 
  createCompany,
  getAllCompanies,
  getCompanyById, 
  updateCompany, 
  deleteCompany 
} from "../../services/group/companies.service";
import { UpdateCompanyInput } from "../../types/company.types";

export const CompaniesController = {
  // Create a new company
  companyCreate: async (req: Request, res: Response): Promise<void> => {
    // Handle image upload middleware
    uploadCompanyFiles(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading files:', err);
        res.status(400).json({
          success: false,
          message: 'File upload failed: ' + err.message,
        });
        return;
      }

      try {
        // Check for image (required)
        const files = (req as any).files;
        if (!files || !files.image || files.image.length === 0) {
          res.status(400).json({
            success: false,
            message: 'Company image is required',
          });
          return;
        }

        // Get the image path
        const imageFile = files.image[0];
        const imagePath = `${UPLOAD_PATHS.COMPANIES_IMAGES}/${imageFile.filename}`;

        // Check if user exists on the request
        const user = (req as any).user;
        if (!user) {
          res.status(401).json({
            success: false,
            message: 'Authentication required. User not found in request.',
          });
          return;
        }
        
        const userId = user.userId;
        if (!userId) {
          res.status(401).json({
            success: false,
            message: 'User ID not found in authentication token',
          });
          return;
        }
        
        // Get user name
        const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
        
        const data = req.body;
        
        // Validate required fields
        if (!data.title || !data.shortDes || !data.longDes || !data.founded || 
            !data.teamSize || !data.location || !data.category || 
            !data.globalPresence || !data.revenue || !data.clientSatisfaction) {
          
          // Delete the uploaded image since validation failed
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          res.status(400).json({
            success: false,
            message: 'All company fields are required.',
          });
          return;
        }
        
        // Create the new company
        const formattedData = {
          title: data.title,
          image: imagePath,
          shortDes: data.shortDes,
          longDes: data.longDes,
          founded: data.founded,
          teamSize: data.teamSize,
          location: data.location,
          category: data.category,
          globalPresence: data.globalPresence,
          revenue: data.revenue,
          clientSatisfaction: data.clientSatisfaction,
          createdBy: userName
        };
        
        try {
          const company = await createCompany(formattedData);
          
          res.status(201).json({
            success: true,
            message: "Company created successfully",
            data: {
              ...company,
              createdAt: formatDate(company.createdAt),
              updatedAt: company.updatedAt ? formatDate(company.updatedAt) : null
            }
          });
        } catch (error) {
          // Delete the uploaded image if company creation fails
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          if ((error as Error).message.includes('already exists')) {
            res.status(400).json({
              success: false,
              message: (error as Error).message
            });
            return;
          }
          
          throw error; // Re-throw to be caught by outer catch block
        }
      } catch (error) {
        console.error("Error creating company:", error);
        
        res.status(500).json({
          success: false,
          message: (error as Error).message || "Failed to create company"
        });
      }
    });
  },

  // Get all companies
  getAllCompanies: async (_req: Request, res: Response): Promise<void> => {
    try {
      const companies = await getAllCompanies();
      
      res.status(200).json({
        success: true,
        message: "Companies fetched successfully",
        data: companies.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          image: item.image,
        //   imageUrl: item.image ? `/${item.image}` : null,
          shortDes: item.shortDes,
          longDes: item.longDes,
          founded: item.founded,
          teamSize: item.teamSize,
          location: item.location,
          category: item.category,
          globalPresence: item.globalPresence,
          revenue: item.revenue,
          clientSatisfaction: item.clientSatisfaction,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: formatDate(item.createdAt),
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch companies"
      });
    }
  },

    // Get a company by ID
  getCompanyById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required',
        });
        return;
      }
      
      const companyId = parseInt(id);
      if (isNaN(companyId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      const company = await getCompanyById(companyId);
      
      res.status(200).json({
        success: true,
        message: "Company fetched successfully",
        data: {
          ...company,
        //   imageUrl: company.image ? `/${company.image}` : null,
          createdAt: formatDate(company.createdAt),
          updatedAt: company.updatedAt ? formatDate(company.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error fetching company:", error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch company"
      });
    }
  },

  // Update a company
  updateCompany: async (req: Request, res: Response): Promise<void> => {
    uploadCompanyFiles(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading files:', err);
        res.status(400).json({
          success: false,
          message: 'File upload failed: ' + err.message,
        });
        return;
      }
  
      try {
        const { id } = req.params;
        
        if (!id) {
          res.status(400).json({
            success: false,
            message: 'Company ID is required',
          });
          return;
        }
        
        const companyId = parseInt(id);
        if (isNaN(companyId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid ID format',
          });
          return;
        }
  
        // Check if user exists on the request
        const user = (req as any).user;
        if (!user || !user.userId) {
          res.status(401).json({
            success: false,
            message: 'Authentication required',
          });
          return;
        }
        
        const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${user.userId}`;
        
        // Get existing company to check if it exists
        const existingCompany = await getCompanyById(companyId);
        
        if (!existingCompany) {
          res.status(404).json({
            success: false,
            message: 'Company not found',
          });
          return;
        }
        
        // Prepare update data
        const updateData: UpdateCompanyInput = {
          updatedBy: userName
        };
        
        // Add basic fields from request body
        if (req.body.title) updateData.title = req.body.title;
        if (req.body.shortDes) updateData.shortDes = req.body.shortDes;
        if (req.body.longDes) updateData.longDes = req.body.longDes;
        if (req.body.founded) updateData.founded = req.body.founded;
        if (req.body.teamSize) updateData.teamSize = req.body.teamSize;
        if (req.body.location) updateData.location = req.body.location;
        if (req.body.category) updateData.category = req.body.category;
        if (req.body.globalPresence) updateData.globalPresence = req.body.globalPresence;
        if (req.body.revenue) updateData.revenue = req.body.revenue;
        if (req.body.clientSatisfaction) updateData.clientSatisfaction = req.body.clientSatisfaction;
        if (req.body.status) updateData.status = req.body.status;
        
        // Add files if uploaded
        const files = (req as any).files;
        if (files && files.image && files.image.length > 0) {
          const imageFile = files.image[0];
          const imagePath = `${UPLOAD_PATHS.COMPANIES_IMAGES}/${imageFile.filename}`;
          updateData.image = imagePath;
        }
        
        // Update the company
        const updatedCompany = await updateCompany(companyId, updateData);
        
        res.status(200).json({
          success: true,
          message: "Company updated successfully",
          data: {
            ...updatedCompany,
            // imageUrl: updatedCompany.image ? `/${updatedCompany.image}` : null,
            createdAt: formatDate(updatedCompany.createdAt),
            updatedAt: updatedCompany.updatedAt ? formatDate(updatedCompany.updatedAt) : null
          }
        });
      } catch (error) {
        console.error("Error updating company:", error);
        
        // If a file was uploaded but the update failed, we should delete it
        const files = (req as any).files;
        if (files && files.image && files.image.length > 0) {
          try {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.resolve(`${UPLOAD_PATHS.COMPANIES_IMAGES}/${files.image[0].filename}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted unused image due to update failure: ${filePath}`);
            }
          } catch (err) {
            console.error('Failed to delete unused image:', err);
          }
        }
        
        const status = (error as Error).message.includes('not found') ? 404 : 
                      (error as Error).message.includes('already exists') ? 400 : 500;
        
        res.status(status).json({
          success: false,
          message: (error as Error).message || "Failed to update company"
        });
      }
    });
  },

//   // Update just the status of a company
//   updateCompanyStatus: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { id } = req.params;
      
//       if (!id) {
//         res.status(400).json({
//           success: false,
//           message: 'Company ID is required',
//         });
//         return;
//       }
      
//       const companyId = parseInt(id);
//       if (isNaN(companyId)) {
//         res.status(400).json({
//           success: false,
//           message: 'Invalid ID format',
//         });
//         return;
//       }
      
//       const { status } = req.body;
      
//       if (!status || (status !== 'ACTIVE' && status !== 'INACTIVE')) {
//         res.status(400).json({
//           success: false,
//           message: 'Valid status (ACTIVE or INACTIVE) is required',
//         });
//         return;
//       }
      
//       // Get user info for updatedBy field
//       const user = (req as any).user;
//       if (!user || !user.userId) {
//         res.status(401).json({
//           success: false,
//           message: 'Authentication required',
//         });
//         return;
//       }
      
//       const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${user.userId}`;
      
//       // Update the company status
//       const updatedCompany = await updateCompanyStatus(companyId, status, userName);
      
//       res.status(200).json({
//         success: true,
//         message: `Company status updated to ${status}`,
//         data: {
//           ...updatedCompany,
//           imageUrl: updatedCompany.image ? `/${updatedCompany.image}` : null,
//           createdAt: formatDate(updatedCompany.createdAt),
//           updatedAt: updatedCompany.updatedAt ? formatDate(updatedCompany.updatedAt) : null
//         }
//       });
//     } catch (error) {
//       console.error("Error updating company status:", error);
      
//       const status = (error as Error).message.includes('not found') ? 404 : 500;
      
//       res.status(status).json({
//         success: false,
//         message: (error as Error).message || "Failed to update company status"
//       });
//     }
//   },

//   // Delete a company
  deleteCompany: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Company ID is required',
        });
        return;
      }
      
      const companyId = parseInt(id);
      if (isNaN(companyId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      await deleteCompany(companyId);
      
      res.status(200).json({
        success: true,
        message: "Company deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete company"
      });
    }
  }
  
};