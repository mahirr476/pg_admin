import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import { 
    createAbout, deleteAbout, getAllAbouts, getAboutById, updateAbout,
    createAboutDetail, getAllAboutDetails, getAboutDetailById,
    updateAboutDetail, deleteAboutDetail
} from "../../../services/parasole/admin/about.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { CreateAboutDetailInput, UpdateAboutDetailInput, UpdateAboutInput } from "../../../types/parasole/about.types";
import { UPLOAD_PATHS, uploadAboutDetailImage, uploadAboutImages } from "../../../middleware/upload.middleware";

export const AboutController = {
    // Create a new about
    create: async (req: Request, res: Response): Promise<void> => {
        uploadAboutImages(req, res, async (err: any) => {
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
              ? files.map((file) => `${UPLOAD_PATHS.ABOUT_IMAGES}/${file.filename}`)
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
    
            // Create the new About
            const aboutData = {
              title,
              description,
              index: indexNum,
              images: imagePaths, // Pass array of image paths (or empty array)
              createdBy: auth.userName,
            };
    
            const about = await createAbout(aboutData);
    
            res.status(201).json({
              success: true,
              message: "About created successfully",
              data: {
                ...about,
                createdAt: formatDate(about.createdAt),
                updatedAt: about.updatedAt ? formatDate(about.updatedAt) : null,
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
              message: (error as Error).message || "Failed to create about",
            });
          }
        });
    },

    // Get an about by ID
    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid about ID"
                });
                return;
            }

            const about = await getAboutById(id);
            if (!about) {
                res.status(404).json({
                    success: false,
                    message: "About not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "About retrieved successfully",
                data: {
                    ...about,
                    createdAt: formatDate(about.createdAt),
                    updatedAt: about.updatedAt ? formatDate(about.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve about"
            });
        }
    },

    // Get all abouts
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const abouts = await getAllAbouts();
            
            res.status(200).json({
                success: true,
                message: "Abouts retrieved successfully",
                data: abouts.map(about => ({
                    ...about,
                    createdAt: formatDate(about.createdAt),
                    updatedAt: about.updatedAt ? formatDate(about.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve abouts"
            });
        }
    },

    // Update an about
    update: async (req: Request, res: Response): Promise<void> => {
        uploadAboutImages(req, res, async (err: any) => {
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
                        message: "Invalid about ID"
                    });
                    return;
                }

                // Check if about exists
                const existingAbout = await getAboutById(id);
                if (!existingAbout) {
                    res.status(404).json({
                        success: false,
                        message: "About not found"
                    });
                    return;
                }

                const { title, description, index, status } = req.body;
                
                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                  ? files.map((file) => `${UPLOAD_PATHS.ABOUT_IMAGES}/${file.filename}`)
                  : []; // Default to empty array if no files are uploaded
                
                // Prepare update data
                const updateData: UpdateAboutInput = {
                    updatedBy: auth.userName
                };

                // Only update provided fields
                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
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

                // Handle images update if provided
                let oldImagePaths: string[] = [];
                if (files.length > 0) {
                    // Store old image paths for deletion later
                    oldImagePaths = existingAbout.images || [];
                    updateData.images = imagePaths;
                }

                // Update the about
                const updatedAbout = await updateAbout(id, updateData);

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
                    message: "About updated successfully",
                    data: {
                        ...updatedAbout,
                        createdAt: formatDate(updatedAbout.createdAt),
                        updatedAt: updatedAbout.updatedAt ? formatDate(updatedAbout.updatedAt) : null
                    }
                });
                
                // Clear image paths after successful update
                imagePaths = [];
            } catch (error) {
                // Delete uploaded images if an error occurs
                deleteUploadedFiles(imagePaths);

                if ((error as Error).message.includes('already exists')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message
                    });
                    return;
                }
                
                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to update about"
                });
            }
        });
    },

    // Delete an about
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid about ID"
                });
                return;
            }

            // Check if about exists and get image paths
            const existingAbout = await getAboutById(id);
            if (!existingAbout) {
                res.status(404).json({
                    success: false,
                    message: "About not found"
                });
                return;
            }

            // Store image paths for deletion later
            const imagePaths = (existingAbout.images as string[]) || [];

            // Delete the about from the database
            await deleteAbout(id);

            // Delete the image files
            if (imagePaths.length > 0) {
                imagePaths.forEach((imagePath: string) => {
                    try {
                        fs.unlinkSync(path.resolve(imagePath));
                    } catch (e) {
                        console.error("Failed to delete image file:", e);
                    }
                });
            }

            res.status(200).json({
                success: true,
                message: "About deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete about"
            });
        }
    },



    // ===========================  For About Detail Controller Manage ===========================

    // Create a new about detail
    createAboutDetail: async (req: Request, res: Response): Promise<void> => {
        uploadAboutDetailImage(req, res, async (err: any) => {
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
                const imagePath = file ? `${UPLOAD_PATHS.ABOUT_DETAIL_IMAGES}/${file.filename}` : null;
    
                const { aboutId, title, description, index, link } = req.body;
            
                if (!aboutId || !title || !description) {
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
                        message: "aboutId, title, and description are required fields."
                    });
                    return;
                }

                // Convert aboutId to a number
                const aboutIdNum = parseInt(aboutId);
                if (isNaN(aboutIdNum)) {
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
                        message: 'About ID must be a valid number',
                    });
                    return;
                }
    
                // Convert index to a number if provided
                let indexNum = undefined;
                if (index !== undefined && index !== '') {
                    indexNum = parseInt(index);
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
                }
    
                // Create the new AboutDetail
                try {
                    // Create properly typed input object
                    const aboutDetailData: CreateAboutDetailInput = {
                        aboutId: aboutIdNum,
                        title,
                        description,
                        image: imagePath || '',
                        createdBy: auth.userName
                    };

                    // Only add index if it was provided and valid
                    if (indexNum !== undefined) {
                        aboutDetailData.index = indexNum;
                    }

                    // Add link if provided
                    if (link) {
                        aboutDetailData.link = link;
                    }
    
                    // Save the about detail to the database
                    const aboutDetail = await createAboutDetail(aboutDetailData);
                    
                    res.status(201).json({
                        success: true,
                        message: "About detail created successfully",
                        data: {
                            ...aboutDetail,
                            createdAt: formatDate(aboutDetail.createdAt),
                            updatedAt: aboutDetail.updatedAt ? formatDate(aboutDetail.updatedAt) : null
                        }
                    });
                } catch (error) {
                    // Delete the uploaded image if about detail creation fails
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
                    message: (error as Error).message || "Failed to create about detail"
                });
            }
        });
    },

    // Get all about details
    getAllAboutDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            const aboutDetails = await getAllAboutDetails();
            
            res.status(200).json({
                success: true,
                message: "About Details retrieved successfully",
                data: aboutDetails.map(item => ({
                    ...item,
                    createdAt: formatDate(item.createdAt),
                    updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve about details"
            });
        }
    },

    // Get an about detail by ID
    getAboutDetailById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid about detail ID"
                });
                return;
            }

            const aboutDetail = await getAboutDetailById(id);
            if (!aboutDetail) {
                res.status(404).json({
                    success: false,
                    message: "About detail not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "About detail retrieved successfully",
                data: {
                    ...aboutDetail,
                    createdAt: formatDate(aboutDetail.createdAt),
                    updatedAt: aboutDetail.updatedAt ? formatDate(aboutDetail.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve about detail"
            });
        }
    },

    // Update an about detail
    updateAboutDetail: async (req: Request, res: Response): Promise<void> => {
        uploadAboutDetailImage(req, res, async (err: any) => {
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
                        message: "Invalid about detail ID"
                    });
                    return;
                }

                // Check if about detail exists
                const existingDetail = await getAboutDetailById(id);
                if (!existingDetail) {
                    res.status(404).json({
                        success: false,
                        message: "About detail not found"
                    });
                    return;
                }

                const { aboutId, title, description, index, status, link } = req.body;
                const file = (req as any).file;
                
                // Prepare update data
                const updateData: UpdateAboutDetailInput = {
                    updatedBy: auth.userName
                };

                // Only update provided fields
                if (aboutId !== undefined && aboutId !== '') {
                    const aboutIdNum = parseInt(aboutId);
                    if (isNaN(aboutIdNum)) {
                        res.status(400).json({
                            success: false,
                            message: 'About ID must be a valid number',
                        });
                        return;
                    }
                    updateData.aboutId = aboutIdNum;
                }

                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
                if (status !== undefined) updateData.status = status;
                
                // Handle optional link field
                if (link !== undefined) {
                    updateData.link = link || null; // Set to null if empty string
                }
                
                // Handle index - can be set or removed
                if (index !== undefined) {
                    if (index === '' || index === null) {
                        // If empty string or null is passed, set index to null (remove it)
                        updateData.index = null;
                    } else {
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
                }

                // Handle image update if provided
                let oldImagePath = null;
                if (file) {
                    oldImagePath = existingDetail.image;
                    updateData.image = `${UPLOAD_PATHS.ABOUT_DETAIL_IMAGES}/${file.filename}`;
                }

                // Update the about detail
                const updatedAboutDetail = await updateAboutDetail(id, updateData);

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
                    message: "About detail updated successfully",
                    data: {
                        ...updatedAboutDetail,
                        createdAt: formatDate(updatedAboutDetail.createdAt),
                        updatedAt: updatedAboutDetail.updatedAt ? formatDate(updatedAboutDetail.updatedAt) : null
                    }
                });
            } catch (error) {
                // If there was a new file and update failed, delete it
                const file = (req as any).file;
                if (file) {
                    const newImagePath = `${UPLOAD_PATHS.ABOUT_DETAIL_IMAGES}/${file.filename}`;
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
                    message: (error as Error).message || "Failed to update about detail"
                });
            }
        });
    },
    
    // Delete an about detail
    deleteAboutDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid about detail ID"
                });
                return;
            }

            // Check if about detail exists
            const existingDetail = await getAboutDetailById(id);
            if (!existingDetail) {
                res.status(404).json({
                    success: false,
                    message: "About detail not found"
                });
                return;
            }

            // Store image path for deletion later
            const imagePath = existingDetail.image;

            // Delete the about detail from the database
            await deleteAboutDetail(id);

            if (imagePath) {
                try {
                    fs.unlinkSync(path.resolve(imagePath));
                } catch (e) {
                    console.error("Failed to delete image file:", e);

                }
            }

            res.status(200).json({
                success: true,
                message: "About detail deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete about detail"
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