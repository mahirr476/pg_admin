import { getActiveMilestone, getMilestoneContent } from "../../../services/group/client/milestone.service";
import { Request, Response } from "express";

export const MilestoneController = {
    getMilestoneContent: async (req: Request, res: Response): Promise<void> => {
        try {

            const milestoneContent = await getMilestoneContent();
            
            res.status(200).json({
                success: true,
                message: "Milestone Content fetched successfully.",
                data: {
                    milestoneContent: milestoneContent,
                }
            });
        } catch (error) {
            console.error("Error fetching Milestone Content:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Milestone Content'
            });
        }
    },

    getMilestone: async (req: Request, res: Response): Promise<void> => {
        try {

            const milestone = await getActiveMilestone();
            
            res.status(200).json({
                success: true,
                message: "Milestone fetched successfully.",
                data: {
                    milestone: milestone,
                }
            });
        } catch (error) {
            console.error("Error fetching Milestone:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Milestone'
            });
        }
    },

    // Add a new combined endpoint
    getAllData: async (req: Request, res: Response): Promise<void> => {
        try {
            // Use Promise.all to fetch all data concurrently
            // here fetch operations start at the same time and run in parallel for the use of Promise.all()
            const [milestoneContent, activeMilestone] = await Promise.all([
                getMilestoneContent(),
                getActiveMilestone()
            ]);
            
            res.status(200).json({
                success: true,
                message: "Milestone page data fetched successfully.",
                data: {
                    milestoneContent: milestoneContent,
                    milestone: activeMilestone
                }
            });
        } catch (error) {
            console.error("Error fetching Milestone page data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Milestone page data'
            });
        }
    },

};