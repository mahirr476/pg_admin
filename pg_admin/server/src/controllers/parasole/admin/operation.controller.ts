import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import {
    createOperation, deleteOperation, getAllOperations, getOperationById, updateOperation,
} from "../../../services/parasole/admin/operation.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { CreateOperationInput, UpdateOperationInput } from "../../../types/parasole/operation.types";
import { UPLOAD_PATHS, uploadOperationImages } from "../../../middleware/upload.middleware";

export const OperationController = {
    // Create a new operation
    create: async (req: Request, res: Response): Promise<void> => {
        uploadOperationImages(req, res, async (err: any) => {
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
                    ? files.map((file) => `${UPLOAD_PATHS.OPERATION_IMAGES}/${file.filename}`)
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

                // Create the new Operation
                const operationData: CreateOperationInput = {
                    title,
                    description,
                    index: indexNum,
                    images: imagePaths, // Pass array of image paths (or empty array)
                    createdBy: auth.userName,
                };

                const operation = await createOperation(operationData);

                res.status(201).json({
                    success: true,
                    message: "Operation created successfully",
                    data: {
                        ...operation,
                        createdAt: formatDate(operation.createdAt),
                        updatedAt: operation.updatedAt ? formatDate(operation.updatedAt) : null,
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
                    message: (error as Error).message || "Failed to create operation",
                });
            }
        });
    },

    // Get all operations
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const operations = await getAllOperations();

            res.status(200).json({
                success: true,
                message: "Operations retrieved successfully",
                data: operations.map(operation => ({
                    ...operation,
                    createdAt: formatDate(operation.createdAt),
                    updatedAt: operation.updatedAt ? formatDate(operation.updatedAt) : null,
                })),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve operations",
            });
        }
    },

    // Get operation by ID
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

            const operation = await getOperationById(id);

            if (!operation) {
                res.status(404).json({
                    success: false,
                    message: "Operation not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Operation retrieved successfully",
                data: {
                    ...operation,
                    createdAt: formatDate(operation.createdAt),
                    updatedAt: operation.updatedAt ? formatDate(operation.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve operation",
            });
        }
    },

    // Update operation
    update: async (req: Request, res: Response): Promise<void> => {
        uploadOperationImages(req, res, async (err: any) => {
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

                // Get existing operation to check if it exists
                const existingOperation = await getOperationById(id);
                if (!existingOperation) {
                    res.status(404).json({
                        success: false,
                        message: "Operation not found",
                    });
                    return;
                }

                const { title, description, index, status } = req.body;

                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                    ? files.map((file) => `${UPLOAD_PATHS.OPERATION_IMAGES}/${file.filename}`)
                    : []; // Default to empty array if no files are uploaded

                // Prepare update data
                const updateData: UpdateOperationInput = {
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

                // Update the operation
                const updatedOperation = await updateOperation(id, updateData);

                res.status(200).json({
                    success: true,
                    message: "Operation updated successfully",
                    data: {
                        ...updatedOperation,
                        createdAt: formatDate(updatedOperation.createdAt),
                        updatedAt: updatedOperation.updatedAt ? formatDate(updatedOperation.updatedAt) : null,
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
                    message: (error as Error).message || "Failed to update operation",
                });
            }
        });
    },

    // Delete operation
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

            // Get existing operation to check if it exists and to get image paths
            const existingOperation = await getOperationById(id);
            if (!existingOperation) {
                res.status(404).json({
                    success: false,
                    message: "Operation not found",
                });
                return;
            }

            // Delete the operation
            await deleteOperation(id);

            // Delete associated images
            if (existingOperation.images && existingOperation.images.length > 0) {
                deleteUploadedFiles(existingOperation.images);
            }

            res.status(200).json({
                success: true,
                message: "Operation deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete operation",
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