import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import {
    createBuyer, deleteBuyer, getAllBuyers, 
    getBuyerById, updateBuyer
} from "../../../services/parasole/admin/buyer.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { 
    CreateBuyerInput, UpdateBuyerInput 
} from "../../../types/parasole/buyer.types";
import { UPLOAD_PATHS, uploadBuyerImages } from "../../../middleware/upload.middleware";

export const BuyerController = {
    // Create a new buyer
    create: async (req: Request, res: Response): Promise<void> => {
        uploadBuyerImages(req, res, async (err: any) => {
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
                    ? files.map((file) => `${UPLOAD_PATHS.BUYER_IMAGES}/${file.filename}`)
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

                // Create the new Buyer
                const buyerData: CreateBuyerInput = {
                    title,
                    description,
                    index: indexNum,
                    images: imagePaths, // Pass array of image paths (or empty array)
                    createdBy: auth.userName,
                };

                const buyer = await createBuyer(buyerData);

                res.status(201).json({
                    success: true,
                    message: "Buyer created successfully",
                    data: {
                        ...buyer,
                        createdAt: formatDate(buyer.createdAt),
                        updatedAt: buyer.updatedAt ? formatDate(buyer.updatedAt) : null,
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
                    message: (error as Error).message || "Failed to create buyer",
                });
            }
        });
    },

    // Get all buyers
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const buyers = await getAllBuyers();

            res.status(200).json({
                success: true,
                message: "Buyers retrieved successfully",
                data: buyers.map(buyer => ({
                    ...buyer,
                    createdAt: formatDate(buyer.createdAt),
                    updatedAt: buyer.updatedAt ? formatDate(buyer.updatedAt) : null,
                })),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve buyers",
            });
        }
    },

    // Get buyer by ID
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

            const buyer = await getBuyerById(id);

            if (!buyer) {
                res.status(404).json({
                    success: false,
                    message: "Buyer not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Buyer retrieved successfully",
                data: {
                    ...buyer,
                    createdAt: formatDate(buyer.createdAt),
                    updatedAt: buyer.updatedAt ? formatDate(buyer.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve buyer",
            });
        }
    },

    // Update buyer
    update: async (req: Request, res: Response): Promise<void> => {
        uploadBuyerImages(req, res, async (err: any) => {
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

                // Get existing buyer to check if it exists
                const existingBuyer = await getBuyerById(id);
                if (!existingBuyer) {
                    res.status(404).json({
                        success: false,
                        message: "Buyer not found",
                    });
                    return;
                }

                const { title, description, index, status } = req.body;

                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                    ? files.map((file) => `${UPLOAD_PATHS.BUYER_IMAGES}/${file.filename}`)
                    : []; // Default to empty array if no files are uploaded

                // Prepare update data
                const updateData: UpdateBuyerInput = {
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
                
                // Handle images update if provided
                let oldImagePaths: string[] = [];
                if (files.length > 0) {
                    // Store old image paths for deletion later
                    oldImagePaths = existingBuyer.images || [];
                    updateData.images = imagePaths;
                }

                // Update the buyer
                const updatedBuyer = await updateBuyer(id, updateData);

                // If update successful and we have new images, delete the old ones
                if (oldImagePaths.length > 0) {
                    oldImagePaths.forEach(oldPath => {
                        try {
                            fs.unlinkSync(path.resolve(oldPath));
                        } catch (e) {
                            console.error("Failed to delete old image file:", e);
                        }
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Buyer updated successfully",
                    data: {
                        ...updatedBuyer,
                        createdAt: formatDate(updatedBuyer.createdAt),
                        updatedAt: updatedBuyer.updatedAt ? formatDate(updatedBuyer.updatedAt) : null,
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
                    message: (error as Error).message || "Failed to update buyer",
                });
            }
        });
    },

    // Delete buyer
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

            // Get existing buyer to check if it exists and to get image paths
            const existingBuyer = await getBuyerById(id);
            if (!existingBuyer) {
                res.status(404).json({
                    success: false,
                    message: "Buyer not found",
                });
                return;
            }

            // Delete the buyer
            await deleteBuyer(id);

            // Delete associated images
            if (existingBuyer.images && existingBuyer.images.length > 0) {
                deleteUploadedFiles(existingBuyer.images);
            }

            res.status(200).json({
                success: true,
                message: "Buyer deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete buyer",
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