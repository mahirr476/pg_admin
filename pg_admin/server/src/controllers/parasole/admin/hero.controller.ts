import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import multer from 'multer';
import { 
    createHero, createHeroDetail, deleteHero, deleteHeroDetail, 
    getAllHeroDetails, getAllHeroes, getHeroById, getHeroDetailById, 
    updateHero, updateHeroDetail } from "../../../services/parasole/admin/hero.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { CreateHeroDetailInput, UpdateHeroDetailInput, UpdateHeroInput } from "../../../types/parasole/hero.types";
import { UPLOAD_PATHS, uploadHeroDetailImage, uploadParasoleHeroImages } from "../../../middleware/upload.middleware";

export const HeroController = {
    // Create a new hero
    create: async (req: Request, res: Response): Promise<void> => {
        uploadParasoleHeroImages(req, res, async (err: any) => {
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
              ? files.map((file) => `${UPLOAD_PATHS.PARASOLE_HERO_IMAGES}/${file.filename}`): []; // Default to empty array if no files are uploaded
    
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
    
            // Create the new Hero
            const heroData = {
              title,
              description,
              index: indexNum,
              images: imagePaths, // Pass array of image paths (or empty array)
              createdBy: auth.userName,
            };
    
            const hero = await createHero(heroData);
    
            res.status(201).json({
              success: true,
              message: "Hero created successfully",
              data: {
                ...hero,
                createdAt: formatDate(hero.createdAt),
                updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null,
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
              message: (error as Error).message || "Failed to create hero",
            });
          }
        });
    },

    // Get a hero by ID
    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid hero ID"
                });
                return;
            }

            const hero = await getHeroById(id);
            if (!hero) {
                res.status(404).json({
                    success: false,
                    message: "Hero not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Hero retrieved successfully",
                data: {
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve hero"
            });
        }
    },

    // Get all heroes
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const heroes = await getAllHeroes();
            
            res.status(200).json({
                success: true,
                message: "Heroes retrieved successfully",
                data: heroes.map(hero => ({
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve heroes"
            });
        }
    },

    // Update a hero
    update: async (req: Request, res: Response): Promise<void> => {
        uploadParasoleHeroImages(req, res, async (err: any) => {
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
                        message: "Invalid hero ID"
                    });
                    return;
                }

                // Check if hero exists
                const existingHero = await getHeroById(id);
                if (!existingHero) {
                    res.status(404).json({
                        success: false,
                        message: "Hero not found"
                    });
                    return;
                }

                const { title, description, index, status } = req.body;
                
                // Get uploaded files
                const files = (req.files as Express.Multer.File[]) || [];
                imagePaths = files.length > 0
                  ? files.map((file) => `${UPLOAD_PATHS.PARASOLE_HERO_IMAGES}/${file.filename}`)
                  : []; // Default to empty array if no files are uploaded
                
                // Prepare update data
                const updateData: UpdateHeroInput = {
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
                    oldImagePaths = existingHero.images || [];
                    updateData.images = imagePaths;
                }

                // Update the hero
                const updatedHero = await updateHero(id, updateData);

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
                    message: "Hero updated successfully",
                    data: {
                        ...updatedHero,
                        createdAt: formatDate(updatedHero.createdAt),
                        updatedAt: updatedHero.updatedAt ? formatDate(updatedHero.updatedAt) : null
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
                    message: (error as Error).message || "Failed to update hero"
                });
            }
        });
    },

    // Delete a hero
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid hero ID"
                });
                return;
            }

            // Check if hero exists and get image paths
            const existingHero = await getHeroById(id);
            if (!existingHero) {
                res.status(404).json({
                    success: false,
                    message: "Hero not found"
                });
                return;
            }

            // Store image paths for deletion later
            // Type assertion to tell TypeScript that images is a string array or undefined
            const imagePaths = (existingHero.images as string[]) || [];

            // Delete the hero from the database
            await deleteHero(id);

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
                message: "Hero deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete hero"
            });
        }
    },



    // ===========================  For Hero Detail Controller Manage ===========================
     

    // Create a new hero detail
    createHeroDetail: async (req: Request, res: Response): Promise<void> => {
        uploadHeroDetailImage(req, res, async (err: any) => {
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
                const imagePath = file ? `${UPLOAD_PATHS.HERO_DETAIL_IMAGES}/${file.filename}` : null;
    
                const { heroId, title, description, index } = req.body;
            
                if (!heroId || !title || !description || index === undefined) {
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
                        message: "heroId, title, description and index are required fields."
                    });
                    return;
                }

                // Convert heroId to a number
                const heroIdNum = parseInt(heroId);
                if (isNaN(heroIdNum)) {
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
                        message: 'Hero ID must be a valid number',
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
    
                // Create the new HeroDetail
                try {
                    // Create properly typed input object
                    const heroDetailData: CreateHeroDetailInput = {
                        heroId: heroIdNum,
                        title,
                        description,
                        index: indexNum,
                        image: imagePath || '',
                        createdBy: auth.userName
                    };
    
                    // Save the hero detail to the database
                    const heroDetail = await createHeroDetail(heroDetailData);
                    
                    res.status(201).json({
                        success: true,
                        message: "Hero detail created successfully",
                        data: {
                            ...heroDetail,
                            createdAt: formatDate(heroDetail.createdAt),
                            updatedAt: heroDetail.updatedAt ? formatDate(heroDetail.updatedAt) : null
                        }
                    });
                } catch (error) {
                    // Delete the uploaded image if hero detail creation fails
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
                    message: (error as Error).message || "Failed to create hero detail"
                });
            }
        });
    },

     // Get all hero details
    getAllHeroDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            const heroDetails = await getAllHeroDetails();
            
            res.status(200).json({
                success: true,
                message: "Hero Details retrieved successfully",
                data: heroDetails.map(item => ({
                    ...item,
                    createdAt: formatDate(item.createdAt),
                    updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve hero details"
            });
        }
    },

    // Get a hero detail by ID
    getHeroDetailById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid hero detail ID"
                });
                return;
            }

            const hero = await getHeroDetailById(id);
            if (!hero) {
                res.status(404).json({
                    success: false,
                    message: "Hero detail not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Hero detail retrieved successfully",
                data: {
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve hero detail"
            });
        }
    },

    // Update a hero detail
    updateHeroDetail: async (req: Request, res: Response): Promise<void> => {
        uploadHeroDetailImage(req, res, async (err: any) => {
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
                        message: "Invalid hero ID"
                    });
                    return;
                }

                // Check if hero detail exists
                const existingDetail  = await getHeroDetailById(id);
                if (!existingDetail) {
                    res.status(404).json({
                        success: false,
                        message: "Hero detail not found"
                    });
                    return;
                }

                const { heroId, title, description, index, status } = req.body;
                const file = (req as any).file;
                
                // Prepare update data
                const updateData: UpdateHeroDetailInput = {
                    updatedBy: auth.userName
                };

                // Only update provided fields

                if (heroId !== undefined) {
                    const heroIdNum = parseInt(heroId);
                    if (isNaN(heroIdNum)) {
                        res.status(400).json({
                            success: false,
                            message: 'Hero ID must be a valid number',
                        });
                        return;
                    }
                    updateData.heroId = heroIdNum;
                }

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

                // Handle image update if provided
                let oldImagePath = null;
                if (file) {
                    oldImagePath = existingDetail.image;
                    updateData.image = `${UPLOAD_PATHS.HERO_DETAIL_IMAGES}/${file.filename}`;
                }

                // Update the hero
                const updatedHeroDe = await updateHeroDetail(id, updateData);

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
                    message: "Hero detail updated successfully",
                    data: {
                        ...updatedHeroDe,
                        createdAt: formatDate(updatedHeroDe.createdAt),
                        updatedAt: updatedHeroDe.updatedAt ? formatDate(updatedHeroDe.updatedAt) : null
                    }
                });
            } catch (error) {
                // If there was a new file and update failed, delete it
                const file = (req as any).file;
                if (file) {
                    const newImagePath = `${UPLOAD_PATHS.HERO_DETAIL_IMAGES}/${file.filename}`;
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
                    message: (error as Error).message || "Failed to update hero detail"
                });
            }
        });
    },
    
    // Delete a hero detail
    deleteHeroDetail: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid hero ID"
                });
                return;
            }

            // Check if hero exists and get image path
            const existingDetail  = await getHeroDetailById(id);
            if (!existingDetail ) {
                res.status(404).json({
                    success: false,
                    message: "Hero detail not found"
                });
                return;
            }

            // Store image path for deletion later
            const imagePath = existingDetail.image;

            // Delete the hero detail from the database
            await deleteHeroDetail(id);

            // Delete the image file
            if (imagePath) {
                try {
                    fs.unlinkSync(path.resolve(imagePath));
                } catch (e) {
                    console.error("Failed to delete image file:", e);
                }
            }

            res.status(200).json({
                success: true,
                message: "Hero detail deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete hero detail"
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