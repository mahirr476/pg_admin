import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createCSR, getAllCSR } from "../../services/group/csr.service";


export const CSRController = {

    // Create a new CSR item
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
                    message: 'Title, description, index are required fields.',
                });
                return;
            }

                // Create the new csr
            const formateData = {
                ...data,
                createdBy: userName
            };

            const csrItem  = await createCSR(formateData);
            
            res.status(201).json({
                success: true,
                message: "CSR item created successfully",
                data: {
                ...csrItem,
                createdAt: formatDate(csrItem.createdAt)
                }
            });
            
        } catch (error) {
        //   console.error("Error creating CSR item:", error);
            res.status(500).json({
            success: false,
            message: (error as Error).message || "Failed to create CSR item"
            });
        }
    },

    // Get all CSR items
    getAll: async (_req: Request, res: Response): Promise<void> => {
        try {
            const csrItems = await getAllCSR();
           
            res.status(200).json({
                success: true,
                message: "CSR items fetched successfully",
                data: csrItems.map(item => ({
                  ...item,
                  createdAt: formatDate(item.createdAt),
                  updatedAt: formatDate(item.updatedAt)
                }))
            });
        } catch (error) {
            console.error("Error fetching CSR items:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetch CSR items"
            });
        }
    },

};