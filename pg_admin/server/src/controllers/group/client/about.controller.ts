import { Request, Response } from "express";
import { getAbout } from '../../../services/group/client/about.service';

export const AboutController = {
    getAboutUs: async (req: Request, res: Response): Promise<void> => {
        try {

            const getAboutData = await getAbout();
            
            res.status(200).json({
                success: true,
                message: "About Us data fetched successfully.",
                data: {
                    aboutUs: getAboutData,
                }
            });
        } catch (error) {
            console.error("Error fetching About Us data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch About Us data'
            });
        }
    },
};