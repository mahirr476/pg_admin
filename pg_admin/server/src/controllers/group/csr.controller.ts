import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { createCSR, createCsrDetail, getAllCSR, getAllCsrDetails } from "../../services/group/csr.service";
import { CreateCsrDetailInput } from "@/types/csrDetail.types";


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

    //

    //Create a new CSR detail
    createDetail: async (req: Request, res: Response): Promise<void> => {
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
            
            // // Validate required fields
            if (!data.csr_id || !data.title || !data.description) {
                res.status(400).json({
                    success: false,
                    message: 'CSR ID, title, and description are required fields.',
                });
                return;
            }

            // Now that we know csr_id exists, convert it to a number
            const csrIdNumber = Number(data.csr_id);
            
            // Validate that csr_id is a valid number
            if (isNaN(csrIdNumber)) {
                res.status(400).json({
                    success: false,
                    message: 'CSR ID must be a valid number.',
                });
                return;
            }
            
            // Create the new CSR detail
            const formattedData = {
                csr_id: csrIdNumber,
                title: data.title,
                description: data.description,
                image: data.image || null,
                createdBy: userName
            };
            
            const csrDetailItem = await createCsrDetail(formattedData);
            
            res.status(201).json({
                success: true,
                message: "CSR detail created successfully",
                data: {
                ...csrDetailItem,
                createdAt: formatDate(csrDetailItem.createdAt),
                // updatedAt: csrDetailItem.updatedAt ? formatDate(csrDetailItem.updatedAt) : null
                }
            });
        } catch (error) {
            console.error("Error creating CSR detail:", error);
            
            // Handle specific errors with appropriate status codes
            if ((error as Error).message.includes('does not exist')) {
                res.status(404).json({
                    success: false,
                    message: (error as Error).message
                });
                return;
            }
            
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create CSR detail"
            });
        }
    },

    // Get all CSR details
    getAllcsrDetail: async (_req: Request, res: Response): Promise<void> => {
        try {
        const csrDetailItems = await getAllCsrDetails();
        
        res.status(200).json({
            success: true,
            message: "CSR details fetched successfully",
            data: csrDetailItems.map(item => ({
                id: item.id,
                csr_id: item.csr_id,
                csrTitle: item.csr.title,
                title: item.title,
                description: item.description,
                image: item.image,
                createdBy: item.createdBy,
                createdAt: formatDate(item.createdAt),
                updatedBy: item.updatedBy,
                updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
            }))
        });
        } catch (error) {
        console.error("Error fetching CSR details:", error);
        res.status(500).json({
            success: false,
            message: (error as Error).message || "Failed to fetch CSR details"
        });
        }
    },

};