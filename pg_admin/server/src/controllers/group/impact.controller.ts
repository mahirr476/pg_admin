import { getImpact } from "../../services/group/impact.service";
// import { upsertImpact, getImpact } from "../../services/group/impact.service";
import { Request, Response } from "express";

export const ImpactController = {
    // Update impact (or create if not exists)
    // update: async (req: Request, res: Response) => {
    //     try {
    //         const data = req.body;
            
    //         // Check if user exists on the request
    //         if (!(req as any).user) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: "Authentication required. User not found in request."
    //             });
    //         }
            
    //         const userId = (req as any).user.userId;
           
    //         if (!userId) {
    //             return res.status(401).json({
    //                 status: "error",
    //                 message: "User ID not found in authentication token"
    //             });
    //         }
            
    //         // Get user name with fallback to user ID if first/last name not available
    //         let userName;
    //         if ((req as any).user.firstName && (req as any).user.lastName) {
    //             userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
    //         } else {
    //             // Fallback to userId if names are not available
    //             userName = `User ${userId}`;
    //         }
            
    //         // Validate required fields
    //         if(!data.title || !data.description) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title and description are required fields.",
    //             });
    //         }
            
    //         // Prepare data
    //         const impactData = {
    //             ...data,
    //             createdBy: userName,
    //             updatedBy: userName
    //         };
            
    //         const impact = await upsertImpact(impactData);
            
    //         return res.status(200).json({
    //             success: true,
    //             message: "Impact saved successfully.",
    //             data: impact,
    //         });
    //     } catch (error) {
    //         console.error("Error saving impact:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message || "Failed to save impact",
    //         });
    //     }
    // },
    
    // Get impact
    get: async (req: Request, res: Response) => {
        try {
            const impact = await getImpact();
            
            if (!impact) {
                return res.status(404).json({
                    success: false,
                    message: "Impact not found.",
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Impact fetched successfully.",
                data: impact,
            });
        } catch (error) {
            console.error("Error fetching impact:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetch impact",
            });
        }
    },
};