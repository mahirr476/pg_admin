// home.controller.ts
import { Request, Response } from "express";
import { getHeroWithDetails } from '../../../services/parasole/client/home.service';

export const HomeController = {
    // getHomepage: async (req: Request, res: Response): Promise<void> => {
    //     try {

    //         const [heroes, details] = await Promise.all([
    //             getAllActiveHeroes(),
    //             getActiveHeroDetails(),
    //         ]);
           
    //         res.status(200).json({
    //             success: true,
    //             message: "Homepage data fetched successfully.",
    //             data: {
    //                 heroes,
    //                 details,
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching homepage data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch homepage data'
    //         });
    //     }
    // },


    getHomepage: async (req: Request, res: Response): Promise<void> => {
        try {

            const heroData = await getHeroWithDetails();
           
            res.status(200).json({
                success: true,
                message: "Homepage data fetched successfully.",
                data: { heroData }
            });
        } catch (error) {
            console.error("Error fetching homepage data:", error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch homepage data'
            });
        }
    },

};


