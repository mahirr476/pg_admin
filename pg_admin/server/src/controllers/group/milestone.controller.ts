import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createMilestone, getAllMilestones, updateMilestone } from "../../services/group/milestone.service";


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

};