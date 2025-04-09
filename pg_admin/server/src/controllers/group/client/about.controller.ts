import { Request, Response } from "express";
import { getAbout, getAllBoardDirectors, getBoardContent } from '../../../services/group/client/about.service';

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

    getBoardContent: async (req: Request, res: Response): Promise<void> => {
        try {

            const getBoardData = await getBoardContent();
            
            res.status(200).json({
                success: true,
                message: "Board Content data fetched successfully.",
                data: {
                    boardContent: getBoardData,
                }
            });
        } catch (error) {
            console.error("Error fetching Board Content data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Board Content data'
            });
        }
    },

    getBoardDirector: async (req: Request, res: Response): Promise<void> => {
        try {

            const getBoardDirector = await getAllBoardDirectors();
            
            res.status(200).json({
                success: true,
                message: "Board Of Director fetched successfully.",
                data: {
                    boardDirector: getBoardDirector,
                }
            });
        } catch (error) {
            console.error("Error fetching Board Of Director data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Board Of Director'
            });
        }
    },

    // Add a new combined endpoint
    getAllAboutData: async (req: Request, res: Response): Promise<void> => {
        try {
            // Use Promise.all to fetch all data concurrently
            // here fetch operations start at the same time and run in parallel for the use ofPromise.all()
            const [aboutData, boardContent, boardDirectors] = await Promise.all([
                getAbout(),
                getBoardContent(),
                getAllBoardDirectors()
            ]);
            
            res.status(200).json({
                success: true,
                message: "All about page data fetched successfully.",
                data: {
                    aboutUs: aboutData,
                    boardContent: boardContent,
                    boardDirector: boardDirectors
                }
            });
        } catch (error) {
            console.error("Error fetching about page data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch about page data'
            });
        }
    }

};