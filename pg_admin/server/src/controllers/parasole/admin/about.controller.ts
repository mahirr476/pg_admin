import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import { 
    createAbout, deleteAbout, getAllAbouts, getAboutById, updateAbout
} from "../../../services/parasole/admin/about.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { UpdateAboutInput } from "../../../types/parasole/about.types";
import { UPLOAD_PATHS, uploadAboutImages } from "../../../middleware/upload.middleware";

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