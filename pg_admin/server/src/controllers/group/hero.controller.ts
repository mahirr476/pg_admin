// import { createOrUpdateHero, getAllHeroes } from "../../services/group/hero.service";
// import { formatDate } from "@/util/dateFormatter";
import { createHero, getAllHeroes, getHeroById, updateHero } from "../../services/group/hero.service";
import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";

export const HeroController = {
    // //Create a new hero
    // create: async (req: Request, res: Response) => {
    //     try {
    //         const data = req.body;
            
    //         // Check if user exists on the request
    //         if (!(req as any).user) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: "Authentication required. User not found in request."
    //             });
    //         }
            
    //         const userId = (req as any).user.userId;
           
    //         if (!userId) {
    //             return res.status(401).json({
    //                 status: "error",
    //                 message: "User ID not found in authentication token"
    //             });
    //         }
            
    //         // Get user name with fallback to user ID if first/last name not available
    //         let userName;
    //         if ((req as any).user.firstName && (req as any).user.lastName) {
    //             userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
    //         } else {
    //             userName = `User ${userId}`;
    //         }
            
    //         // console.log('User object:', (req as any).user);
            
    //         // Validate required fields
    //         if(!data.title || !data.description) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title, description are required fields.",
    //             });
    //         }
            
    //         const heroData = {
    //             ...data,
    //             createdBy: userName,
    //         };
            
    //         const hero = await createHero(heroData);
            
    //         return res.status(201).json({
    //             success: true,
    //             message: "Hero created successfully.",
    //             data: hero,
    //         });
    //     } catch (error) {
    //         // console.error("Error creating hero:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message || "Failed to create hero",
    //         });
    //     }
    // },

    // Create or update a hero
    // createOrUpdate: async (req: Request, res: Response) => {
    //     try {
    //         const data = req.body;
    //         const heroId = req.body.id; // If ID is provided, it's an update
            
    //         // Check if user exists on the request
    //         if (!(req as any).user) {
    //             return res.status(401).json({
    //                 success: false,
    //                 message: "Authentication required. User not found in request."
    //             });
    //         }
            
    //         const userId = (req as any).user.userId;
           
    //         if (!userId) {
    //             return res.status(401).json({
    //                 status: "error",
    //                 message: "User ID not found in authentication token"
    //             });
    //         }
            
    //         // Get user name with fallback to user ID if first/last name not available
    //         let userName;
    //         if ((req as any).user.firstName && (req as any).user.lastName) {
    //             userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
    //         } else {
    //             // Fallback to userId if names are not available
    //             userName = `User ${userId}`;
    //         }
            
    //         // Validate required fields
    //         if(!data.title || !data.description) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title, description are required fields.",
    //             });
    //         }
            
    //         // Prepare data for create/update
    //         const heroData = {
    //             ...data,
    //             createdBy: userName,
    //             updatedBy: userName
    //         };
            
    //         const hero = await createOrUpdateHero(heroId, heroData);
            
    //         const isNewRecord = !heroId;
    //         return res.status(isNewRecord ? 201 : 200).json({
    //             success: true,
    //             message: isNewRecord ? "Hero created successfully." : "Hero updated successfully.",
    //             data: hero,
    //         });
    //     } catch (error) {
    //         console.error("Error saving hero:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message || "Failed to save hero",
    //         });
    //     }
    // },





    // Create a new hero
    create: async (req: Request, res: Response) => {
        try {
            const data = req.body;
            
            // Check if user exists on the request
            if (!(req as any).user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request."
                });
            }
            
            const userId = (req as any).user.userId;
           
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token"
                });
            }
            
            // Get user name with fallback to user ID if first/last name not available
            let userName;
            if ((req as any).user.firstName && (req as any).user.lastName) {
                userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
            } else {
                // Fallback to userId if names are not available
                userName = `User ${userId}`;
            }
            
            // Validate required fields
            if(!data.title || !data.description || data.index === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, and index are required fields.",
                });
            }
            
            const heroData = {
                ...data,
                createdBy: userName
            };
            
            const hero = await createHero(heroData);
            
            return res.status(201).json({
                success: true,
                message: "Hero created successfully.",
                data: hero,
            });
        } catch (error) {
            console.error("Error creating hero:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create hero",
            });
        }
    },

    // Update an existing hero
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const data = req.body;
            
            // Check if user exists on the request
            if (!(req as any).user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request."
                });
            }
            
            const userId = (req as any).user.userId;
           
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token"
                });
            }
            
            // Get user name for updatedBy field
            let userName;
            if ((req as any).user.firstName && (req as any).user.lastName) {
                userName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
            } else {
                userName = `User ${userId}`;
            }
            
            // Validate required fields
            if(!data.title || !data.description || data.index === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, and index are required fields.",
                });
            }
            
            // Check if hero exists
            const existingHero = await getHeroById(Number(id));
            if (!existingHero) {
                return res.status(404).json({
                    success: false,
                    message: `Hero with ID ${id} not found.`,
                });
            }
            
            const heroData = {
                ...data,
                updatedBy: userName
            };
            
            const hero = await updateHero(Number(id), heroData);
            
            return res.status(200).json({
                success: true,
                message: "Hero updated successfully.",
                data: hero,
            });
        } catch (error) {
            console.error("Error updating hero:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to update hero",
            });
        }
    },

    // Get all heroes
    getAll: async (req: Request, res: Response) => {
        try {
            const heroes = await getAllHeroes();

            if (!heroes) {
                return res.status(404).json({
                    success: false,
                    message: "Heros not found.",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Heroes fetched successfully.",
                // data: heroes,
                data: heroes.map(hero => ({
                    ...hero,
                    createdAt: formatDate(hero.createdAt),
                    updatedAt: formatDate(hero.updatedAt)
                })),
            });
        } catch (error) {
            console.error("Error fetching heroes:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetching",
            });
        }
    },
};