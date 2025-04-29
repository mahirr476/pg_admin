import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import {
    createCompliance, deleteCompliance, getAllCompliances, getComplianceById, updateCompliance
} from "../../../services/parasole/admin/compliance.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { UpdateComplianceInput } from "../../../types/parasole/compliance.types";
import { UPLOAD_PATHS, uploadComplianceImages } from "../../../middleware/upload.middleware";

export const ComplianceController = {
    // Create a new compliance
    create: async (req: Request, res: Response): Promise<void> => {
        uploadComplianceImages(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading images:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePaths: string[] = [];

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                    ? files.map((file) => `${UPLOAD_PATHS.COMPLIANCE_IMAGES}/${file.filename}`)
                    : []; // Default to empty array if no files are uploaded

                const { title, description, index } = req.body;

                // Validate required fields
                if (!title || !description || index === undefined) {
                    throw new Error("Title, description, and index are required fields.");
                }

                // Convert index to a number
                const indexNum = parseInt(index);
                if (isNaN(indexNum)) {
                    throw new Error('Index must be a valid number');
                }

                // Create the new Compliance
                const complianceData = {
                    title,
                    description,
                    index: indexNum,
                    images: imagePaths, // Pass array of image paths (or empty array)
                    createdBy: auth.userName,
                };

                const compliance = await createCompliance(complianceData);

                res.status(201).json({
                    success: true,
                    message: "Compliance created successfully",
                    data: {
                        ...compliance,
                        createdAt: formatDate(compliance.createdAt),
                        updatedAt: compliance.updatedAt ? formatDate(compliance.updatedAt) : null,
                    },
                });

                // Clear image paths after successful creation
                imagePaths = [];
            } catch (error) {
                // Delete uploaded images if an error occurs
                deleteUploadedFiles(imagePaths);

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('slug')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message,
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to create compliance",
                });
            }
        });
    },

    // Get all compliances
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const compliances = await getAllCompliances();

            res.status(200).json({
                success: true,
                message: "Compliances retrieved successfully",
                data: compliances.map(compliance => ({
                    ...compliance,
                    createdAt: formatDate(compliance.createdAt),
                    updatedAt: compliance.updatedAt ? formatDate(compliance.updatedAt) : null,
                })),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve compliances",
            });
        }
    },

    // Get compliance by ID
    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
                return;
            }

            const compliance = await getComplianceById(id);

            if (!compliance) {
                res.status(404).json({
                    success: false,
                    message: "Compliance not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Compliance retrieved successfully",
                data: {
                    ...compliance,
                    createdAt: formatDate(compliance.createdAt),
                    updatedAt: compliance.updatedAt ? formatDate(compliance.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve compliance",
            });
        }
    },

    // Update compliance
    update: async (req: Request, res: Response): Promise<void> => {
        uploadComplianceImages(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading images:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePaths: string[] = [];

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid ID format",
                    });
                    return;
                }

                // Get existing compliance to check if it exists
                const existingCompliance = await getComplianceById(id);
                if (!existingCompliance) {
                    res.status(404).json({
                        success: false,
                        message: "Compliance not found",
                    });
                    return;
                }

                
                const { title, description, index, status } = req.body;

                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                    ? files.map((file) => `${UPLOAD_PATHS.COMPLIANCE_IMAGES}/${file.filename}`)
                    : []; // Default to empty array if no files are uploaded


                // Prepare update data
                const updateData: UpdateComplianceInput = {
                    updatedBy: auth.userName
                };

                // Only include fields that are provided in the request
                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
                if (index !== undefined) {
                    const indexNum = parseInt(index);
                    if (isNaN(indexNum)) {
                        throw new Error('Index must be a valid number');
                    }
                    updateData.index = indexNum;
                }
                if (status !== undefined) updateData.status = status;
                if (imagePaths !== undefined) updateData.images = imagePaths;

                // Update the compliance
                const updatedCompliance = await updateCompliance(id, updateData);

                res.status(200).json({
                    success: true,
                    message: "Compliance updated successfully",
                    data: {
                        ...updatedCompliance,
                        createdAt: formatDate(updatedCompliance.createdAt),
                        updatedAt: updatedCompliance.updatedAt ? formatDate(updatedCompliance.updatedAt) : null,
                    },
                });
            } catch (error) {
                // Delete uploaded images if an error occurs
                if (imagePaths && imagePaths.length > 0) {
                    deleteUploadedFiles(imagePaths);
                }

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('slug')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message,
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to update compliance",
                });
            }
        });
    },

    // Delete compliance
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
                return;
            }

            // Get existing compliance to check if it exists and to get image paths
            const existingCompliance = await getComplianceById(id);
            if (!existingCompliance) {
                res.status(404).json({
                    success: false,
                    message: "Compliance not found",
                });
                return;
            }

            // Delete the compliance
            await deleteCompliance(id);

            // Delete associated images
            if (existingCompliance.images && existingCompliance.images.length > 0) {
                deleteUploadedFiles(existingCompliance.images);
            }

            res.status(200).json({
                success: true,
                message: "Compliance deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete compliance",
            });
        }
    },
};

// Helper function to delete uploaded files
const deleteUploadedFiles = (filePaths: string[]): void => {
    try {
        filePaths.forEach((filePath) => {
            fs.unlinkSync(path.resolve(filePath));
        });
    } catch (e) {
        console.error("Failed to delete image files:", e);
    }
};