import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import {
    createCompliance, createComplianceDetail, deleteCompliance, deleteComplianceDetail, getAllComplianceDetails, getAllCompliances, getComplianceById, getComplianceDetailById, updateCompliance,
    updateComplianceDetail
} from "../../../services/parasole/admin/compliance.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { CreateComplianceDetailInput, UpdateComplianceDetailInput, UpdateComplianceInput } from "../../../types/parasole/compliance.types";
import { UPLOAD_PATHS, uploadComplianceDetailImage, uploadComplianceImages } from "../../../middleware/upload.middleware";

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


    // ===========================  For Compliance Detail Controller Manage ===========================

    // Create a new compliance detail
    createComplianceDetail: async (req: Request, res: Response): Promise<void> => {
        uploadComplianceDetailImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }
    
            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;
    
                const file = (req as any).file;
                const imagePath = file ? `${UPLOAD_PATHS.COMPLIANCE_DETAIL_IMAGES}/${file.filename}` : null;
    
                const { complianceId, title, description, shortDescrip, index } = req.body;
            
                if (!complianceId || !title || !description || index === undefined) {
                    // Remove the uploaded image since validation failed
                    if (imagePath) {
                        try {
                            fs.unlinkSync(path.resolve(imagePath));
                        } catch (e) {
                            console.error("Failed to delete image file:", e);
                        }
                    }
                    res.status(400).json({
                        success: false,
                        message: "complianceId, title, description and index are required fields."
                    });
                    return;
                }

                // Convert complianceId to a number
                const complianceIdNum = parseInt(complianceId);
                if (isNaN(complianceIdNum)) {
                    // Clean up the uploaded file
                    if (imagePath) {
                        try {
                            fs.unlinkSync(path.resolve(imagePath));
                        } catch (e) {
                            console.error("Failed to delete image file:", e);
                        }
                    }

                    res.status(400).json({
                        success: false,
                        message: 'Compliance ID must be a valid number',
                    });
                    return;
                }
    
                // Convert index to a number
                const indexNum = parseInt(index);
                if (isNaN(indexNum)) {
                    // Clean up the uploaded file
                    if (imagePath) {
                        try {
                            fs.unlinkSync(path.resolve(imagePath));
                        } catch (e) {
                            console.error("Failed to delete image file:", e);
                        }
                    }
                    
                    res.status(400).json({
                        success: false,
                        message: 'Index must be a valid number',
                    });
                    return;
                }
    
                // Create the new ComplianceDetail
                try {
                    // Create properly typed input object
                    const complianceDetailData: CreateComplianceDetailInput = {
                        complianceId: complianceIdNum,
                        title,
                        description,
                        shortDescrip: shortDescrip || null,
                        index: indexNum,
                        image: imagePath || '',
                        createdBy: auth.userName
                    };
    
                    // Save the compliance detail to the database
                    const complianceDetail = await createComplianceDetail(complianceDetailData);
                    
                    res.status(201).json({
                        success: true,
                        message: "Compliance detail created successfully",
                        data: {
                            ...complianceDetail,
                            createdAt: formatDate(complianceDetail.createdAt),
                            updatedAt: complianceDetail.updatedAt ? formatDate(complianceDetail.updatedAt) : null
                        }
                    });
                } catch (error) {
                    // Delete the uploaded image if compliance detail creation fails
                    if (imagePath) {
                        try {
                            fs.unlinkSync(path.resolve(imagePath));
                        } catch (e) {
                            console.error("Failed to delete image file:", e);
                        }
                    }
                    
                    throw error; // Re-throw to be caught by outer catch block
                }
            } catch (error) {
                if ((error as Error).message.includes('already exists')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message
                    });
                    return;
                }
                
                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to create compliance detail"
                });
            }
        });
    },

    // Get all compliance details
    getAllComplianceDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            const complianceDetails = await getAllComplianceDetails();
            
            res.status(200).json({
                success: true,
                message: "Compliance details retrieved successfully",
                data: complianceDetails.map(item => ({
                    ...item,
                    createdAt: formatDate(item.createdAt),
                    updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve compliance details"
            });
        }
    },

    // Get a compliance detail by ID
    getComplianceDetailById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid compliance detail ID"
                });
                return;
            }

            const complianceDetail = await getComplianceDetailById(id);
            if (!complianceDetail) {
                res.status(404).json({
                    success: false,
                    message: "Compliance detail not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Compliance detail retrieved successfully",
                data: {
                    ...complianceDetail,
                    createdAt: formatDate(complianceDetail.createdAt),
                    updatedAt: complianceDetail.updatedAt ? formatDate(complianceDetail.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve compliance detail"
            });
        }
    },

    // Update a compliance detail
    updateComplianceDetail: async (req: Request, res: Response): Promise<void> => {
        uploadComplianceDetailImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid compliance detail ID"
                    });
                    return;
                }

                // Check if compliance detail exists
                const existingDetail = await getComplianceDetailById(id);
                if (!existingDetail) {
                    res.status(404).json({
                        success: false,
                        message: "Compliance detail not found"
                    });
                    return;
                }

                const { complianceId, title, description, shortDescrip, index, status } = req.body;
                const file = (req as any).file;
                
                // Prepare update data
                const updateData: UpdateComplianceDetailInput = {
                    updatedBy: auth.userName
                };

                // Only update provided fields
                if (complianceId !== undefined) {
                    const complianceIdNum = parseInt(complianceId);
                    if (isNaN(complianceIdNum)) {
                        res.status(400).json({
                            success: false,
                            message: 'Compliance ID must be a valid number',
                        });
                        return;
                    }
                    updateData.complianceId = complianceIdNum;
                }

                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
                if (shortDescrip !== undefined) updateData.shortDescrip = shortDescrip;
                if (status !== undefined) updateData.status = status;
                if (index !== undefined) {
                    const indexNum = parseInt(index);
                    if (isNaN(indexNum)) {
                        res.status(400).json({
                            success: false,
                            message: 'Index must be a valid number',
                        });
                        return;
                    }
                    updateData.index = indexNum;
                }

                // Handle image update if provided
                let oldImagePath = null;
                if (file) {
                    oldImagePath = existingDetail.image;
                    updateData.image = `${UPLOAD_PATHS.COMPLIANCE_DETAIL_IMAGES}/${file.filename}`;
                }

                // Update the compliance detail
                const updatedComplianceDetail = await updateComplianceDetail(id, updateData);

                // If update successful and we have a new image, delete the old one
                if (oldImagePath) {
                    try {
                        fs.unlinkSync(path.resolve(oldImagePath));
                    } catch (e) {
                        console.error("Failed to delete old image file:", e);
                    }
                }

                res.status(200).json({
                    success: true,
                    message: "Compliance detail updated successfully",
                    data: {
                        ...updatedComplianceDetail,
                        createdAt: formatDate(updatedComplianceDetail.createdAt),
                        updatedAt: updatedComplianceDetail.updatedAt ? formatDate(updatedComplianceDetail.updatedAt) : null
                    }
                });
            } catch (error) {
                // If there was a new file and update failed, delete it
                const file = (req as any).file;
                if (file) {
                    const newImagePath = `${UPLOAD_PATHS.COMPLIANCE_DETAIL_IMAGES}/${file.filename}`;
                    try {
                        fs.unlinkSync(path.resolve(newImagePath));
                    } catch (e) {
                        console.error("Failed to delete new image file after update error:", e);
                    }
                }

                if ((error as Error).message.includes('already exists') || 
                    (error as Error).message.includes('does not exist') ||
                    (error as Error).message.includes('slug')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message
                    });
                    return;
                }
                
                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to update compliance detail"
                });
            }
        });
    },
    
    // Delete a compliance detail
    deleteComplianceDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid compliance detail ID"
                });
                return;
            }

            // Check if compliance detail exists and get image path
            const existingDetail = await getComplianceDetailById(id);
            if (!existingDetail) {
                res.status(404).json({
                    success: false,
                    message: "Compliance detail not found"
                });
                return;
            }

            // Store image path for deletion later
            const imagePath = existingDetail.image;

            // Delete the compliance detail from the database
            await deleteComplianceDetail(id);

            // Delete the image file if it exists
            if (imagePath) {
                try {
                    fs.unlinkSync(path.resolve(imagePath));
                } catch (e) {
                    console.error("Failed to delete image file:", e);
                }
            }

            res.status(200).json({
                success: true,
                message: "Compliance detail deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete compliance detail"
            });
        }
    }
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