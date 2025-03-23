import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createMilestone, createMileDetail, deleteMilestone, getAllMilestones, updateMilestone, getAllMilestoneDetails, updateMilestoneDetail } from "../../services/group/milestone.service";
import { createUploadMiddleware, UPLOAD_PATHS } from "../../middleware/upload.middleware";

const uploadMilestoneImage = createUploadMiddleware(UPLOAD_PATHS.MILESTONE_IMAGES).single('image');

export const MilestoneController = {
    // Create a new milestone
  create: async (req: Request, res: Response): Promise<void> => {
    try {
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
      if (!data.title || !data.description || !data.orderIndex) {
        res.status(400).json({
          success: false,
          message: 'Title, description and orderIndex are required fields.',
        });
        return;
      }
      
      // Create the new milestone
      const formattedData = {
        ...data,
        orderIndex: parseInt(data.orderIndex),
        createdBy: userName
      };
      
      const milestone = await createMilestone(formattedData);
      
      res.status(201).json({
        success: true,
        message: "Milestone created successfully",
        data: {
          ...milestone,
          createdAt: formatDate(milestone.createdAt),
          updatedAt: milestone.updatedAt ? formatDate(milestone.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error creating milestone:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to create milestone"
      });
    }
  },

  // Get all milestones
  getAllMilestone: async (_req: Request, res: Response): Promise<void> => {
    try {
      const milestones = await getAllMilestones();
      
      res.status(200).json({
        success: true,
        message: "Milestones fetched successfully",
        data: milestones.map(item => ({
          ...item,
          createdAt: formatDate(item.createdAt),
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch milestones"
      });
    }
  },

  // Get a milestone by ID
//   getById: async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id = parseInt(req.params.id);
      
//       if (isNaN(id)) {
//         res.status(400).json({
//           success: false,
//           message: "Invalid ID. Must be a number."
//         });
//         return;
//       }
      
//       const milestone = await getMilestoneById(id);
      
//       res.status(200).json({
//         success: true,
//         message: "Milestone fetched successfully",
//         data: {
//           ...milestone,
//           createdAt: formatDate(milestone.createdAt),
//           updatedAt: milestone.updatedAt ? formatDate(milestone.updatedAt) : null
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching milestone:", error);
      
//       if ((error as Error).message.includes('not found')) {
//         res.status(404).json({
//           success: false,
//           message: (error as Error).message
//         });
//         return;
//       }
      
//       res.status(500).json({
//         success: false,
//         message: (error as Error).message || "Failed to fetch milestone"
//       });
//     }
//   },
  
  // Update a milestone
  updateMilestone: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid ID. Must be a number."
        });
        return;
      }
      
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
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : `User ${userId}`;
      
      const data = req.body;
      
      // Parse orderIndex if provided
      if (data.orderIndex !== undefined) {
        data.orderIndex = parseInt(data.orderIndex);
      }
      
      // Add updatedBy to data
      const updateData = {
        ...data,
        updatedBy: userName
      };
      
      const updatedMilestone = await updateMilestone(id, updateData);
      
      res.status(200).json({
        success: true,
        message: "Milestone updated successfully",
        data: {
          ...updatedMilestone,
          createdAt: formatDate(updatedMilestone.createdAt),
          updatedAt: updatedMilestone.updatedAt ? formatDate(updatedMilestone.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      if ((error as Error).message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to update milestone"
      });
    }
  },

  // Delete a milestone
  DeleteMilestone: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid ID. Must be a number."
        });
        return;
      }
      
      await deleteMilestone(id);
      
      res.status(200).json({
        success: true,
        message: "Milestone deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting milestone:", error);
      
      if ((error as Error).message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to delete milestone"
      });
    }
  },



  // Create a new milestone detail
//   createMilestoneDetail: async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Check if user exists on the request
//       const user = (req as any).user;
//       if (!user) {
//         res.status(401).json({
//           success: false,
//           message: 'Authentication required. User not found in request.',
//         });
//         return;
//       }
      
//       const userId = user.userId;
//       if (!userId) {
//         res.status(401).json({
//           success: false,
//           message: 'User ID not found in authentication token',
//         });
//         return;
//       }
      
//       // Get user name
//       const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
      
//       const data = req.body;
      
//       // Validate required fields
//       if (!data.year || !data.title || !data.description || !data.image) {
//         res.status(400).json({
//           success: false,
//           message: 'Year, title, description, and image are required fields.',
//         });
//         return;
//       }
      
//       // Create the new milestone detail
//       const formattedData = {
//         ...data,
//         createdBy: userName
//       };
      
//       const milestoneDetail = await createMileDetail(formattedData);
      
//       res.status(201).json({
//         success: true,
//         message: "Milestone detail created successfully",
//         data: {
//           ...milestoneDetail,
//           createdAt: formatDate(milestoneDetail.createdAt),
//           updatedAt: milestoneDetail.updatedAt ? formatDate(milestoneDetail.updatedAt) : null
//         }
//       });
//     } catch (error) {
//       console.error("Error creating milestone detail:", error);
//       res.status(500).json({
//         success: false,
//         message: (error as Error).message || "Failed to create milestone detail"
//       });
//     }
//   },

  // Create a new milestone detail
  createMilestoneDetail: async (req: Request, res: Response): Promise<void> => {
    // Handle file upload
    uploadMilestoneImage(req, res, async (err) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
        return;
      }

      try {
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
        if (!data.year || !data.title || !data.description) {
          res.status(400).json({
            success: false,
            message: 'Year, title, and description are required fields.',
          });
          return;
        }
        
        // Validate that an image was uploaded
        if (!req.file) {
          res.status(400).json({
            success: false,
            message: 'An image file is required.',
          });
          return;
        }
        
        // Store the image path consistently
        const imagePath = `${UPLOAD_PATHS.MILESTONE_IMAGES}/${req.file.filename}`;
        
        // Create the new milestone detail
        const formattedData = {
          year: data.year,
          title: data.title,
          description: data.description,
          image: imagePath,
          createdBy: userName
        };
        
        const milestoneDetail = await createMileDetail(formattedData);
        
        res.status(201).json({
          success: true,
          message: "Milestone detail created successfully",
          data: {
            ...milestoneDetail,
            createdAt: formatDate(milestoneDetail.createdAt),
            updatedAt: milestoneDetail.updatedAt ? formatDate(milestoneDetail.updatedAt) : null,
            // Add image URL for frontend - using consistent path format
            imageUrl: milestoneDetail.image ? `/${milestoneDetail.image}` : null
          }
        });
      } catch (error) {
        console.error("Error creating milestone detail:", error);
        res.status(500).json({
          success: false,
          message: (error as Error).message || "Failed to create milestone detail"
        });
      }
    });
  },

  // Get all milestone details
  getAllMDetail: async (_req: Request, res: Response): Promise<void> => {
    try {
      const milestoneDetails = await getAllMilestoneDetails();
      
      res.status(200).json({
        success: true,
        message: "Milestone details fetched successfully",
        data: milestoneDetails.map(item => ({
          ...item,
          createdAt: formatDate(item.createdAt),
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null,
          // Add image URL for frontend
          imageUrl: item.image ? `/${item.image}` : null
        }))
      });
    } catch (error) {
      console.error("Error fetching milestone details:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch milestone details"
      });
    }
  },

  // Update a milestone detail
  updateMDetail: async (req: Request, res: Response): Promise<void> => {
    // Handle file upload
    uploadMilestoneImage(req, res, async (err) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed',
        });
        return;
      }

      try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
          res.status(400).json({
            success: false,
            message: "Invalid ID. Must be a number."
          });
          return;
        }
        
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
        
        // Store the image path if a new file was uploaded
        let imagePath = undefined; // undefined means keep existing image
        if (req.file) {
          // Store the relative path from the public directory
          imagePath = `${UPLOAD_PATHS.MILESTONE_IMAGES}/${req.file.filename}`;
        }
        
        // Add updatedBy and image to data
        const updateData = {
          ...data,
          image: imagePath,
          updatedBy: userName
        };
        
        const updatedMilestoneDetail = await updateMilestoneDetail(id, updateData);
        
        res.status(200).json({
          success: true,
          message: "Milestone detail updated successfully",
          data: {
            ...updatedMilestoneDetail,
            createdAt: formatDate(updatedMilestoneDetail.createdAt),
            updatedAt: updatedMilestoneDetail.updatedAt ? formatDate(updatedMilestoneDetail.updatedAt) : null,
            // Add image URL for frontend - using consistent path format
            imageUrl: updatedMilestoneDetail.image ? `/${updatedMilestoneDetail.image}` : null
          }
        });
      } catch (error) {
        console.error("Error updating milestone detail:", error);
        
        if ((error as Error).message.includes('not found')) {
          res.status(404).json({
            success: false,
            message: (error as Error).message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: (error as Error).message || "Failed to update milestone detail"
        });
      }
    });
  },

};