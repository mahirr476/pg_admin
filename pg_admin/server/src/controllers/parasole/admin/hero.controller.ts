import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { createHero, deleteHero, getAllHeroes, getHeroById, updateHero } from "../../../services/parasole/admin/hero.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { CreateHeroInput, UpdateHeroInput } from "../../../types/parasole/hero.types";
import { UPLOAD_PATHS, uploadHeroImage } from "../../../middleware/upload.middleware";

export const HeroController = {
    // Create a new hero
    create: async (req: Request, res: Response): Promise<void> => {
        uploadHeroImage(req, res, async (err: any) => {
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
                if (!file) {
                    res.status(400).json({
                        success: false,
                        message: 'Hero image is required',
                    });
                    return;
                }

                // Get the image path
                const imagePath = `${UPLOAD_PATHS.HERO_IMAGES}/${file.filename}`;

                const { title, description, index } = req.body;
            
                if (!title || !description || index === undefined) {
                    // Remove the uploaded image since validation failed
                    try {
                        fs.unlinkSync(path.resolve(imagePath));
                    } catch (e) {
                        console.error("Failed to delete image file:", e);
                    }
                    res.status(400).json({
                        success: false,
                        message: "Title, description and index are required fields."
                    });
                    return;
                }

                // Convert index to a number
                const indexNum = parseInt(index);
                if (isNaN(indexNum)) {
                    // Clean up the uploaded file
                    try {
                        fs.unlinkSync(path.resolve(imagePath));
                    } catch (e) {
                        console.error("Failed to delete image file:", e);
                    }
                    
                    res.status(400).json({
                        success: false,
                        message: 'Index must be a valid number',
                    });
                    return;
                }

                // Create the new Hero
                try {
                    // Create properly typed input object
                    const heroData: CreateHeroInput = {
                        title,
                        description,
                        index: indexNum,
                        image: imagePath,
                        createdBy: auth.userName
                    };

                    // Save the hero to the database
                    const hero = await createHero(heroData);
                    
                    res.status(201).json({
                        success: true,
                        message: "Hero created successfully",
                        data: {
                            ...hero,
                            createdAt: formatDate(hero.createdAt),
                            updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                        }
                    });
                } catch (error) {
                    // Delete the uploaded image if hero creation fails
                    try {
                        fs.unlinkSync(path.resolve(imagePath));
                    } catch (e) {
                        console.error("Failed to delete image file:", e);
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
                    message: (error as Error).message || "Failed to create hero"
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

     // Update a hero
     update: async (req: Request, res: Response): Promise<void> => {
        uploadHeroImage(req, res, async (err: any) => {
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

                // Check if hero exists
                const existingHero = await getHeroById(id);
                if (!existingHero) {
                    res.status(404).json({
                        success: false,
                        message: "Hero not found"
                    });
                    return;
                }

                const { title, description, index } = req.body;
                const file = (req as any).file;
                
                // Prepare update data
                const updateData: UpdateHeroInput = {
                    updatedBy: auth.userName
                };

                // Only update provided fields
                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
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
                    oldImagePath = existingHero.image;
                    updateData.image = `${UPLOAD_PATHS.HERO_IMAGES}/${file.filename}`;
                }

                // Update the hero
                const updatedHero = await updateHero(id, updateData);

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
                    message: "Hero updated successfully",
                    data: {
                        ...updatedHero,
                        createdAt: formatDate(updatedHero.createdAt),
                        updatedAt: updatedHero.updatedAt ? formatDate(updatedHero.updatedAt) : null
                    }
                });
            } catch (error) {
                // If there was a new file and update failed, delete it
                const file = (req as any).file;
                if (file) {
                    const newImagePath = `${UPLOAD_PATHS.HERO_IMAGES}/${file.filename}`;
                    try {
                        fs.unlinkSync(path.resolve(newImagePath));
                    } catch (e) {
                        console.error("Failed to delete new image file after update error:", e);
                    }
                }

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

            // Check if hero exists and get image path
            const existingHero = await getHeroById(id);
            if (!existingHero) {
                res.status(404).json({
                    success: false,
                    message: "Hero not found"
                });
                return;
            }

            // Store image path for deletion later
            const imagePath = existingHero.image;

            // Delete the hero from the database
            await deleteHero(id);

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
                message: "Hero deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete hero"
            });
        }
    }

};

