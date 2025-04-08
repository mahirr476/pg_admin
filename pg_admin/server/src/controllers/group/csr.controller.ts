import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createCSR, createCsrDetail, deleteCSR, deleteCsrDetail, getAllCSR, getAllCsrDetails, updateCSR, updateCsrDetail } from "../../services/group/csr.service";
import { createUploadMiddleware, UPLOAD_PATHS } from "../../middleware/upload.middleware";
import fs from 'fs';
import path from 'path';
import { getAuthenticatedUser } from "../../util/auth.utils";
import { UpdateCSRInput } from "../../types/csr.types";
import { CreateCsrDetailInput, UpdateCsrDetailInput } from "../../types/csrDetail.types";

const uploadCSRImage = createUploadMiddleware(UPLOAD_PATHS.CSR_IMAGES).single('image');


export const CSRController = {

    // Create a new CSR item
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;

      const { title, description, orderIndex } = req.body;

      // Validate required fields
      if (!title || !description || orderIndex === undefined) {
        res.status(400).json({
          success: false,
          message: 'Title, description, and order index are required fields.',
        });
        return;
      }

      // Convert orderIndex to a number
      const orderIndexNum = parseInt(orderIndex);
      if (isNaN(orderIndexNum)) {
        res.status(400).json({
          success: false,
          message: 'Order index must be a valid number',
        });
        return;
      }

      // Create the new CSR item
      const csrItem = await createCSR({
        title,
        description,
        orderIndex: orderIndexNum,
        createdBy: auth.userName,
      });

      res.status(201).json({
        success: true,
        message: 'CSR item created successfully',
        data: {
          ...csrItem,
          createdAt: formatDate(csrItem.createdAt),
          updatedAt: csrItem.updatedAt ? formatDate(csrItem.updatedAt) : null,
        },
      });
    } catch (error) {
      console.error('Error creating CSR item:', error);

      if ((error as Error).message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: (error as Error).message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Failed to create CSR item',
      });
    }
  },

  // Get all CSR items
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const csrItems = await getAllCSR();

      res.status(200).json({
        success: true,
        message: 'CSR items fetched successfully',
        data: csrItems.map((item) => ({
          ...item,
          createdAt: formatDate(item.createdAt),
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null,
        })),
      });
    } catch (error) {
      console.error('Error fetching CSR items:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Failed to fetch CSR items',
      });
    }
  },

  // Update a CSR item
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;

      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'CSR item ID is required',
        });
        return;
      }

      const csrId = parseInt(id);
      if (isNaN(csrId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }

      // Prepare update data
      const updateData: UpdateCSRInput = {
        updatedBy: auth.userName,
      };

      // Add basic fields from request body
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.status) updateData.status = req.body.status;

      // Handle orderIndex specifically to convert to number
      if (req.body.orderIndex !== undefined) {
        const orderIndexNum = parseInt(req.body.orderIndex);
        if (isNaN(orderIndexNum)) {
          res.status(400).json({
            success: false,
            message: 'Order index must be a valid number',
          });
          return;
        }
        updateData.orderIndex = orderIndexNum;
      }

      // Update the CSR item
      const updatedCSRItem = await updateCSR(csrId, updateData);

      res.status(200).json({
        success: true,
        message: 'CSR item updated successfully',
        data: {
          ...updatedCSRItem,
          createdAt: formatDate(updatedCSRItem.createdAt),
          updatedAt: updatedCSRItem.updatedAt ? formatDate(updatedCSRItem.updatedAt) : null,
        },
      });
    } catch (error) {
      console.error('Error updating CSR item:', error);

      const status = (error as Error).message.includes('not found')
        ? 404
        : (error as Error).message.includes('already exists')
        ? 400
        : 500;

      res.status(status).json({
        success: false,
        message: (error as Error).message || 'Failed to update CSR item',
      });
    }
  },

  // Delete a CSR item
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;

      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'CSR item ID is required',
        });
        return;
      }

      const csrId = parseInt(id);
      if (isNaN(csrId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }

      await deleteCSR(csrId);

      res.status(200).json({
        success: true,
        message: 'CSR item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting CSR item:', error);

      const status = (error as Error).message.includes('not found') ? 404 : 500;

      res.status(status).json({
        success: false,
        message: (error as Error).message || 'Failed to delete CSR item',
      });
    }
  },


  // ===========================  CSR Detail CONTROLLERS ===========================


    // Create a new CSR detail
  createDetail: async (req: Request, res: Response): Promise<void> => {
    uploadCSRImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
        return;
      }

      try {
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;

        const { csr_id, title, description } = req.body;

        // Validate required fields
        if (!csr_id || !title || !description) {
          res.status(400).json({
            success: false,
            message: 'CSR ID, title, and description are required fields.',
          });
          return;
        }

        // Convert csr_id to a number
        const csrIdNumber = parseInt(csr_id, 10);
        if (isNaN(csrIdNumber)) {
          res.status(400).json({
            success: false,
            message: 'CSR ID must be a valid number.',
          });
          return;
        }

        // Store the image path consistently
        let imagePath = null;
        if ((req as any).file) {
          imagePath = `${UPLOAD_PATHS.CSR_IMAGES}/${(req as any).file.filename}`;
        }

        // Create the new CSR detail
        const csrDetailData: CreateCsrDetailInput = {
          csr_id: csrIdNumber,
          title,
          description,
          image: imagePath,
          createdBy: auth.userName,
        };

        const csrDetail = await createCsrDetail(csrDetailData);

        res.status(201).json({
          success: true,
          message: 'CSR detail created successfully',
          data: {
            ...csrDetail,
            createdAt: formatDate(csrDetail.createdAt),
            // imageUrl: csrDetail.image ? `/${csrDetail.image}` : null,
          },
        });
      } catch (error) {
        console.error('Error creating CSR detail:', error);
        res.status(500).json({
          success: false,
          message: (error as Error).message || 'Failed to create CSR detail',
        });
      }
    });
  },

  // Get all CSR details
  getAllcsrDetail: async (req: Request, res: Response): Promise<void> => {
    try {
      const csrDetails = await getAllCsrDetails();

      res.status(200).json({
        success: true,
        message: 'CSR details fetched successfully',
        data: csrDetails.map((detail) => ({
          ...detail,
          createdAt: formatDate(detail.createdAt),
          updatedAt: detail.updatedAt ? formatDate(detail.updatedAt) : null,
          // imageUrl: detail.image ? `/${detail.image}` : null,
        })),
      });
    } catch (error) {
      console.error('Error fetching CSR details:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Failed to fetch CSR details',
      });
    }
  },

  // Update a CSR detail
  updateCSRDetail: async (req: Request, res: Response): Promise<void> => {
    uploadCSRImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
        return;
      }

      try {
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;

        const { id } = req.params;
        const { title, description } = req.body;

        const csrDetailId = parseInt(id, 10);
        if (isNaN(csrDetailId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid CSR detail ID format',
          });
          return;
        }

        const updateData: UpdateCsrDetailInput = {
          updatedBy: auth.userName,
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;

        // Update the image path if a new image is uploaded
        if ((req as any).file) {
          updateData.image = `${UPLOAD_PATHS.CSR_IMAGES}/${(req as any).file.filename}`;
        }

        const updatedCsrDetail = await updateCsrDetail(csrDetailId, updateData);

        res.status(200).json({
          success: true,
          message: 'CSR detail updated successfully',
          data: {
            ...updatedCsrDetail,
            createdAt: formatDate(updatedCsrDetail.createdAt),
            updatedAt: updatedCsrDetail.updatedAt ? formatDate(updatedCsrDetail.updatedAt) : null,
            // imageUrl: updatedCsrDetail.image ? `/${updatedCsrDetail.image}` : null,
          },
        });
      } catch (error) {

        if ((req as any).file) {
          const imagePath = path.join(process.cwd(), 'public', `${UPLOAD_PATHS.CSR_IMAGES}/${(req as any).file.filename}`);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        
        console.error('Error updating CSR detail:', error);

        const status = (error as Error).message.includes('not found') ? 404 : 500;

        res.status(status).json({
          success: false,
          message: (error as Error).message || 'Failed to update CSR detail',
        });
      }
    });
  },

  // Delete a CSR detail
  deleteCSRDetail: async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;

      const { id } = req.params;

      const csrDetailId = parseInt(id, 10);
      if (isNaN(csrDetailId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid CSR detail ID format',
        });
        return;
      }

      await deleteCsrDetail(csrDetailId);

      res.status(200).json({
        success: true,
        message: 'CSR detail deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting CSR detail:', error);

      const status = (error as Error).message.includes('not found') ? 404 : 500;

      res.status(status).json({
        success: false,
        message: (error as Error).message || 'Failed to delete CSR detail',
      });
    }
  },



};