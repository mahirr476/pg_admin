import { Request, Response } from "express";
import { getActiveImpacts, getAllActiveHeroes, getAllBusinesses, getAllNews } from '../../../services/group/client/home.service';

export const HomeController = {
    getHomepage: async (req: Request, res: Response): Promise<void> => {
        try {

            const activeHeroes = await getAllActiveHeroes();
            const activeImpacts = await getActiveImpacts();
            const activeBusiness = await getAllBusinesses();
            const activeNews = await getAllNews();
            
            // Combine the results into a single response object
            res.status(200).json({
                success: true,
                message: "Homepage data fetched successfully.",
                data: {
                    heroes: activeHeroes,
                    impacts: activeImpacts,
                    business: activeBusiness,
                    news: activeNews
                }
            });
        } catch (error) {
            console.error("Error fetching homepage data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch homepage data'
            });
        }
    },

};


