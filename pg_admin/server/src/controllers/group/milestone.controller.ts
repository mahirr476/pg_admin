import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createMilestone, getAllMilestones } from "../../services/group/milestone.service";


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

};