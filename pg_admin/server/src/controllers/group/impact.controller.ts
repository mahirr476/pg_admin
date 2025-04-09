import { Request, Response } from "express";
import { createImpact, deleteImpact, getImpact, getImpactById, updateImpact } from "../../services/group/impact.service";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { CreateImpactInput, UpdateImpactInput } from "../../types/impact.types";

export const ImpactController = {
    // Create a new impact
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const { title, description, number } = req.body;
            
            // Validate required fields
            if (!title || !description || number === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and number are required fields."
                });
                return;
            }
            
            // Create properly typed input object
            const impactData: CreateImpactInput = {
                title,
                description,
                number,
                createdBy: auth.userName
            };
            
            const impact = await createImpact(impactData);
            
            res.status(201).json({
                success: true,
                message: "Impact created successfully",
                data: {
                    ...impact,
                    createdAt: formatDate(impact.createdAt),
                    updatedAt: impact.updatedAt ? formatDate(impact.updatedAt) : null
                }
            });
        } catch (error) {
            console.error("Error creating impact:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create impact"
            });
        }
    },

    // Update an existing impact
    update: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;
            
            const { id } = req.params;
            const { title, description, number, status } = req.body;
            
            // Validate required fields
            if (!title || !description || number === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and number are required fields."
                });
                return;
            }
            
            // Convert ID to number
            const impactId = parseInt(id);
            if (isNaN(impactId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format"
                });
                return;
            }
            
            // Check if impact exists
            try {
                await getImpactById(impactId);
            } catch (error) {
                res.status(404).json({
                    success: false,
                    message: (error as Error).message || `Impact with ID ${id} not found`
                });
                return;
            }
            
            
            // Create properly typed update object
            const impactData: UpdateImpactInput = {
                title,
                description,
                number,
                status: status as 'ACTIVE' | 'INACTIVE',
                updatedBy: auth.userName
            };
            
            const impact = await updateImpact(impactId, impactData);
            
            res.status(200).json({
                success: true,
                message: "Impact updated successfully",
                data: {
                    ...impact,
                    createdAt: formatDate(impact.createdAt),
                    updatedAt: impact.updatedAt ? formatDate(impact.updatedAt) : null
                }
            });
        } catch (error) {
            console.error("Error updating impact:", error);
            
            const status = (error as Error).message.includes('not found') ? 404 : 500;
            
            res.status(status).json({
                success: false,
                message: (error as Error).message || "Failed to update impact"
            });
        }
    },

    // Get all impacts
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const impacts = await getImpact();
            res.status(200).json({
                success: true,
                message: 'Impacts fetched successfully',
                data: impacts.map(impact => ({
                    ...impact,
                    createdAt: formatDate(impact.createdAt),
                    updatedAt: impact.updatedAt ? formatDate(impact.updatedAt) : null
                }))
            });
        } catch (error) {
            console.error("Error fetching impacts:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch impacts'
            });
        }
    },

    // Delete an impact
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const { id } = req.params;

            // Convert ID to number
            const impactId = parseInt(id);
            if (isNaN(impactId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format"
                });
                return;
            }

            await deleteImpact(impactId);

            res.status(200).json({
                success: true,
                message: "Impact deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting impact:", error);

            const status = (error as Error).message.includes('not found') ? 404 : 500;

            res.status(status).json({
                success: false,
                message: (error as Error).message || "Failed to delete impact"
            });
        }
    }
};