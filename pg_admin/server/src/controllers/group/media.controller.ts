// controllers/group/media.controller.ts
import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { 
  createMedia, 
  getAllMedia, 
//   getMediaById, 
  updateMedia, 
//   updateMediaStatus,
  deleteMedia 
} from "../../services/group/media.service";
import { UpdateMediaInput } from "../../types/media.types";

export const MediaController = {
  // Create a new media entry
  createMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return; 
      
      const { title, orderIndex, description } = req.body;
      
      // Validate required fields
      if (!title || orderIndex === undefined || !description) {
        res.status(400).json({
          success: false,
          message: 'Title, order index, and description are required fields.',
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
      
      // Create the new media
      const media = await createMedia({
        title,
        orderIndex: orderIndexNum,
        description,
        createdBy: auth.userName
      });
      
      res.status(201).json({
        success: true,
        message: "Media created successfully",
        data: {
          ...media,
          createdAt: formatDate(media.createdAt),
          updatedAt: media.updatedAt ? formatDate(media.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error creating media:", error);
      
      if ((error as Error).message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to create media"
      });
    }
  },

  // Get all media entries
  getAllMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return; 
      
      const mediaList = await getAllMedia();
      
      res.status(200).json({
        success: true,
        message: "Media fetched successfully",
        data: mediaList.map(item => ({
          id: item.id,
          title: item.title,
          orderIndex: item.orderIndex,
          description: item.description,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: formatDate(item.createdAt),
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media"
      });
    }
  },

//   // Get a media entry by ID
//   getMediaById: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { id } = req.params;
      
//       if (!id) {
//         res.status(400).json({
//           success: false,
//           message: 'Media ID is required',
//         });
//         return;
//       }
      
//       const mediaId = parseInt(id);
//       if (isNaN(mediaId)) {
//         res.status(400).json({
//           success: false,
//           message: 'Invalid ID format',
//         });
//         return;
//       }
      
//       const media = await getMediaById(mediaId);
      
//       res.status(200).json({
//         success: true,
//         message: "Media fetched successfully",
//         data: {
//           ...media,
//           createdAt: formatDate(media.createdAt),
//           updatedAt: media.updatedAt ? formatDate(media.updatedAt) : null
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching media:", error);
      
//       if ((error as Error).message.includes('not found')) {
//         res.status(404).json({
//           success: false,
//           message: (error as Error).message
//         });
//         return;
//       }
      
//       res.status(500).json({
//         success: false,
//         message: (error as Error).message || "Failed to fetch media"
//       });
//     }
//   },

  // Update a media entry
  updateMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media ID is required',
        });
        return;
      }
      
      const mediaId = parseInt(id);
      if (isNaN(mediaId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      // Prepare update data
      const updateData: UpdateMediaInput = {
        updatedBy: auth.userName
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
      
      // Update the media
      const updatedMedia = await updateMedia(mediaId, updateData);
      
      res.status(200).json({
        success: true,
        message: "Media updated successfully",
        data: {
          ...updatedMedia,
          createdAt: formatDate(updatedMedia.createdAt),
          updatedAt: updatedMedia.updatedAt ? formatDate(updatedMedia.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error updating media:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 
                    (error as Error).message.includes('already exists') ? 400 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to update media"
      });
    }
  },

//   // Update just the status of a media entry
//   updateMediaStatus: async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Check authentication
//       const auth = getAuthenticatedUser(req, res);
//       if (!auth) return; // Response already sent by the utility function
      
//       const { id } = req.params;
      
//       if (!id) {
//         res.status(400).json({
//           success: false,
//           message: 'Media ID is required',
//         });
//         return;
//       }
      
//       const mediaId = parseInt(id);
//       if (isNaN(mediaId)) {
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
      
//       // Update the media status
//       const updatedMedia = await updateMediaStatus(mediaId, status, auth.userName);
      
//       res.status(200).json({
//         success: true,
//         message: `Media status updated to ${status}`,
//         data: {
//           ...updatedMedia,
//           createdAt: formatDate(updatedMedia.createdAt),
//           updatedAt: updatedMedia.updatedAt ? formatDate(updatedMedia.updatedAt) : null
//         }
//       });
//     } catch (error) {
//       console.error("Error updating media status:", error);
      
//       const status = (error as Error).message.includes('not found') ? 404 : 500;
      
//       res.status(status).json({
//         success: false,
//         message: (error as Error).message || "Failed to update media status"
//       });
//     }
//   },

  // Delete a media entry
  deleteMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media ID is required',
        });
        return;
      }
      
      const mediaId = parseInt(id);
      if (isNaN(mediaId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      await deleteMedia(mediaId);
      
      res.status(200).json({
        success: true,
        message: "Media deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting media:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete media"
      });
    }
  }
};