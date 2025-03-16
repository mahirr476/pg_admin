import { upsertAbout } from "../../services/group/about.service";
import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";


export const AboutController = {

    // Create or update about information
    upsert: async (req: Request, res: Response) => {
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
            if(!data.title || !data.description || !data.mission || !data.vision || !data.about) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, mission, vision, and about are required fields.",
                });
            }
            
            // Add the user info to the data
            const aboutData = {
                ...data,
                createdBy: userName,
                updatedBy: userName
            };
            
            const about = await upsertAbout(aboutData);
            
            // Format dates for response
            const formattedAbout = {
                ...about,
                createdAt: formatDate(about.createdAt),
                updatedAt: formatDate(about.updatedAt)
            };
            
            // Get existing record to determine if this was a create or update
            const existingAbout = await getAbout();
            const isNewRecord = !existingAbout || existingAbout.id === about.id;
            
            return res.status(isNewRecord ? 201 : 200).json({
                success: true,
                message: isNewRecord ? "About information created successfully." : "About information updated successfully.",
                data: formattedAbout,
            });
        } catch (error) {
            console.error("Error saving about information:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to save about information",
            });
        }
    },

    
};