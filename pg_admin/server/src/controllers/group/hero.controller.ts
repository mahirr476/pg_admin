import { Request, Response } from "express";
import { createHero, deleteHero, getAllHeroes, getHeroById, updateHero } from "../../services/group/hero.service";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { CreateHeroInput, UpdateHeroInput } from "../../types/hero.types";

export const HeroController = {
    // Create a new hero
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const { title, description, index } = req.body;
            
            // Validate required fields
            if (!title || !description || index === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and index are required fields."
                });
                return;
            }

            // Convert index to a number
            const indexNum = parseInt(index);
            if (isNaN(indexNum)) {
                res.status(400).json({
                    success: false,
                    message: 'Index must be a valid number',
                });
                return;
            }
            
            // Create properly typed input object
            const heroData: CreateHeroInput = {
                title,
                description,
                index: indexNum,
                createdBy: auth.userName
            };
            
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
            console.error("Error creating hero:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create hero"
            });
        }
    },

    // Update an existing hero
    update: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;
            
            const { id } = req.params;
            const { title, description, index, status } = req.body;
            
            // Validate required fields
            if (!title || !description || index === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and index are required fields."
                });
                return;
            }
            
            // Convert ID to number
            const heroId = parseInt(id);
            if (isNaN(heroId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format"
                });
                return;
            }
            
            // Check if hero exists
            try {
                await getHeroById(heroId);
            } catch (error) {
                res.status(404).json({
                    success: false,
                    message: (error as Error).message || `Hero with ID ${id} not found`
                });
                return;
            }
            
            // Convert index to a number
            const indexNum = parseInt(index);
            if (isNaN(indexNum)) {
                res.status(400).json({
                    success: false,
                    message: 'Index must be a valid number',
                });
                return;
            }
            
            // Create properly typed update object
            const heroData: UpdateHeroInput = {
                title,
                description,
                index: indexNum,
                status: status as 'ACTIVE' | 'INACTIVE',
                updatedBy: auth.userName
            };
            
            const hero = await updateHero(heroId, heroData);
            
            res.status(200).json({
                success: true,
                message: "Hero updated successfully",
                data: {
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                }
            });
        } catch (error) {
            console.error("Error updating hero:", error);
            
            const status = (error as Error).message.includes('not found') ? 404 : 500;
            
            res.status(status).json({
                success: false,
                message: (error as Error).message || "Failed to update hero"
            });
        }
    },

    // Get all heroes
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const heroes = await getAllHeroes();
            res.status(200).json({
                success: true,
                message: 'Heroes fetched successfully',
                data: heroes.map(hero => ({
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: hero.updatedAt ? formatDate(hero.updatedAt) : null
                }))
            });
        } catch (error) {
            console.error("Error fetching heroes:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch heroes'
            });
        }
    },

    // Delete a hero
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const { id } = req.params;

            // Convert ID to number
            const heroId = parseInt(id);
            if (isNaN(heroId)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format"
                });
                return;
            }

            await deleteHero(heroId);

            res.status(200).json({
                success: true,
                message: "Hero deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting hero:", error);

            const status = (error as Error).message.includes('not found') ? 404 : 500;

            res.status(status).json({
                success: false,
                message: (error as Error).message || "Failed to delete hero"
            });
        }
    }
};