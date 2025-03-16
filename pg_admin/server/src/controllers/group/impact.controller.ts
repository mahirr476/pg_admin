import { createImpact, getImpact, getImpactById, updateImpact } from "../../services/group/impact.service";
// import { upsertImpact, getImpact } from "../../services/group/impact.service";
import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";

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
    




    // Create a new impact
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            // Check if user exists on the request
            if (!(req as any).user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request."
                });
            }
            
            const userId = (req as any).user.userId;
           
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token"
                });
            }
            
            // Get user name with fallback to user ID if first/last name not available
            let userName;
            if ((req as any).user.firstName && (req as any).user.lastName) {
                userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
            } else {
                // Fallback to userId if names are not available
                userName = `User ${userId}`;
            }
            
            // Validate required fields
            if(!data.title || !data.description || !data.number) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, and number are required fields.",
                });
            }
            
            const impactData = {
                ...data,
                createdBy: userName
            };
            
            const impact = await createImpact(impactData);
            
            return res.status(201).json({
                success: true,
                message: "Impact created successfully.",
                data: impact,
            });
        } catch (error) {
            console.error("Error creating impact:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create impact",
            });
        }
    },

    // Update an existing impact
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            
            // Check if user exists on the request
            if (!(req as any).user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request."
                });
            }
            
            const userId = (req as any).user.userId;
           
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token"
                });
            }
            
            // Get user name for updatedBy field
            let userName;
            if ((req as any).user.firstName && (req as any).user.lastName) {
                userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
            } else {
                userName = `User ${userId}`;
            }
            
            // Validate required fields
            if(!data.title || !data.description || !data.number) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, and number are required fields.",
                });
            }
            
            // Check if impact exists
            const existingImpact = await getImpactById(Number(id));
            if (!existingImpact) {
                return res.status(404).json({
                    success: false,
                    message: `Impact with ID ${id} not found.`,
                });
            }
            
            const impactData = {
                ...data,
                updatedBy: userName
            };
            
            const impact = await updateImpact(Number(id), impactData);
            
            return res.status(200).json({
                success: true,
                message: "Impact updated successfully.",
                data: impact,
            });
        } catch (error) {
            console.error("Error updating impact:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to update impact",
            });
        }
    },

    // Get impact
    get: async (req: Request, res: Response) => {
        try {
            const impacts = await getImpact();
            
            if (!impacts) {
                return res.status(404).json({
                    success: false,
                    message: "Impact not found.",
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Impact fetched successfully.",
                // data: impact,
                data: impacts.map(impact => ({
                    ...impact,
                    createdAt: formatDate(impact.createdAt),
                    updatedAt: formatDate(impact.updatedAt)
                })),
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