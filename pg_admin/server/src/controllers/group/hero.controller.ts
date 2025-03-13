// import { createHero } from "../../services/group/hero.service";
// import { Request, Response } from "express";

// export const HeroController = {

//     //Create a new hero
//     create: async (req: Request, res: Response) => {
//         try {
//             const data = req.body;

//             // Check if user exists on the request
//             if (!(req as any).user) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Authentication required. User not found in request."
//                 });
//             }

//             const userId = (req as any).user.userId;
            
//             if (!userId) {
//                 res.status(401).json({
//                     status: "error",
//                     message: "User ID not found in authentication token"
//                 });
//                 return;
//             }

//             const userName = (req as any).user.firstName + ' ' + (req as any).user.lastName;

//             // Validate required fields
//             if(!data.title || !data.description) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Title, description are required fields.",
//                 });
//             }

//             const heroData = {
//                 ...data,
//                 createdBy: userName
//             };

//             const hero = await createHero(heroData);

//             return res.status(201).json({
//                 success: true,
//                 message: "Hero created successfully.",
//                 data: hero,
//             });

//         } catch (error) {
//             console.error("Error creating hero:", error);
//             return res.status(500).json({
//                 success: false,
//                 message: (error as Error).message || "Failed to create hero",
//             });
//         }
//     },

// };


import { createHero } from "../../services/group/hero.service";
import { Request, Response } from "express";

export const HeroController = {
    //Create a new hero
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
                userName = `User ${userId}`;
            }
            
            // console.log('User object:', (req as any).user);
            
            // Validate required fields
            if(!data.title || !data.description) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description are required fields.",
                });
            }
            
            const heroData = {
                ...data,
                createdBy: userName,
            };
            
            const hero = await createHero(heroData);
            
            return res.status(201).json({
                success: true,
                message: "Hero created successfully.",
                data: hero,
            });
        } catch (error) {
            // console.error("Error creating hero:", error);
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to create hero",
            });
        }
    },
};