import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import { 
    createHero, 
    deleteHero, 
    getAllHeroes, 
    getHeroById, 
    updateHero 
} from "../../services/group/hero.service";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { UpdateHeroInput } from "../../types/hero.types";
import { UPLOAD_PATHS, uploadHeroImages } from "../../middleware/upload.middleware";

export const HeroController = {
    // Create a new hero
    create: async (req: Request, res: Response): Promise<void> => {
        uploadHeroImages(req, res, async (err: any) => {
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
              ? files.map((file) => `${UPLOAD_PATHS.HERO_IMAGES}/${file.filename}`)
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
                (error as Error).message.includes('unique index')) {
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
                message: "Heroes0 retrieved successfully",
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
        uploadHeroImages(req, res, async (err: any) => {
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
                  ? files.map((file) => `${UPLOAD_PATHS.HERO_IMAGES}/${file.filename}`)
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

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('unique index')) {
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
            const imagePaths = existingHero.images || [];

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

// import { Request, Response } from "express";
// import { createHero, deleteHero, getAllHeroes, getHeroById, updateHero } from "../../services/group/hero.service";
// import { formatDate } from "../../util/dateFormatter";
// import { getAuthenticatedUser } from "../../util/auth.utils";
// import { CreateHeroInput, UpdateHeroInput } from "../../types/hero.types";

// export const HeroController = {
//     // Create a new hero
//     create: async (req: Request, res: Response): Promise<void> => {
//         try {
//             // Check authentication
//             const auth = getAuthenticatedUser(req, res);
//             if (!auth) return;

//             const { title, description, index } = req.body;
            
//             // Validate required fields
//             if (!title || !description || index === undefined) {
//                 res.status(400).json({
//                     success: false,
//                     message: "Title, description, and index are required fields."
//                 });
//                 return;
//             }

//             // Convert index to a number
//             const indexNum = parseInt(index);
//             if (isNaN(indexNum)) {
//                 res.status(400).json({
//                     success: false,
//                     message: 'Index must be a valid number',
//                 });
//                 return;
//             }
            
//             // Create properly typed input object
//             const heroData: CreateHeroInput = {
//                 title,
//                 description,
//                 index: indexNum,
//                 createdBy: auth.userName
//             };
            
//             const hero = await createHero(heroData);
            
//             res.status(201).json({
//                 success: true,
//                 message: "Hero created successfully",
//                 data: {
//                     ...hero,
//                     createdAt: formatDate(hero.createdAt),
//                     updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
//                 }
//             });
//         } catch (error) {
//             console.error("Error creating hero:", error);
//             res.status(500).json({
//                 success: false,
//                 message: (error as Error).message || "Failed to create hero"
//             });
//         }
//     },

//     // Update an existing hero
//     update: async (req: Request, res: Response): Promise<void> => {
//         try {
//             // Check authentication
//             const auth = getAuthenticatedUser(req, res);
//             if (!auth) return;
            
//             const { id } = req.params;
//             const { title, description, index, status } = req.body;
            
//             // Validate required fields
//             if (!title || !description || index === undefined) {
//                 res.status(400).json({
//                     success: false,
//                     message: "Title, description, and index are required fields."
//                 });
//                 return;
//             }
            
//             // Convert ID to number
//             const heroId = parseInt(id);
//             if (isNaN(heroId)) {
//                 res.status(400).json({
//                     success: false,
//                     message: "Invalid ID format"
//                 });
//                 return;
//             }
            
//             // Check if hero exists
//             try {
//                 await getHeroById(heroId);
//             } catch (error) {
//                 res.status(404).json({
//                     success: false,
//                     message: (error as Error).message || `Hero with ID ${id} not found`
//                 });
//                 return;
//             }
            
//             // Convert index to a number
//             const indexNum = parseInt(index);
//             if (isNaN(indexNum)) {
//                 res.status(400).json({
//                     success: false,
//                     message: 'Index must be a valid number',
//                 });
//                 return;
//             }
            
//             // Create properly typed update object
//             const heroData: UpdateHeroInput = {
//                 title,
//                 description,
//                 index: indexNum,
//                 status: status as 'ACTIVE' | 'INACTIVE',
//                 updatedBy: auth.userName
//             };
            
//             const hero = await updateHero(heroId, heroData);
            
//             res.status(200).json({
//                 success: true,
//                 message: "Hero updated successfully",
//                 data: {
//                     ...hero,
//                     createdAt: formatDate(hero.createdAt),
//                     updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
//                 }
//             });
//         } catch (error) {
//             console.error("Error updating hero:", error);
            
//             const status = (error as Error).message.includes('not found') ? 404 : 500;
            
//             res.status(status).json({
//                 success: false,
//                 message: (error as Error).message || "Failed to update hero"
//             });
//         }
//     },

//     // Get all heroes
//     getAll: async (req: Request, res: Response): Promise<void> => {
//         try {
//             const heroes = await getAllHeroes();
//             res.status(200).json({
//                 success: true,
//                 message: 'Heroes fetched successfully',
//                 data: heroes.map(hero => ({
//                     ...hero,
//                     createdAt: formatDate(hero.createdAt),
//                     updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
//                 }))
//             });
//         } catch (error) {
//             console.error("Error fetching heroes:", error);
//             res.status(500).json({
//                 success: false,
//                 message: (error as Error).message || 'Failed to fetch heroes'
//             });
//         }
//     },

//     // Delete a hero
//     delete: async (req: Request, res: Response): Promise<void> => {
//         try {
//             // Check authentication
//             const auth = getAuthenticatedUser(req, res);
//             if (!auth) return;

//             const { id } = req.params;

//             // Convert ID to number
//             const heroId = parseInt(id);
//             if (isNaN(heroId)) {
//                 res.status(400).json({
//                     success: false,
//                     message: "Invalid ID format"
//                 });
//                 return;
//             }

//             await deleteHero(heroId);

//             res.status(200).json({
//                 success: true,
//                 message: "Hero deleted successfully"
//             });
//         } catch (error) {
//             console.error("Error deleting hero:", error);

//             const status = (error as Error).message.includes('not found') ? 404 : 500;

//             res.status(status).json({
//                 success: false,
//                 message: (error as Error).message || "Failed to delete hero"
//             });
//         }
//     },

// };