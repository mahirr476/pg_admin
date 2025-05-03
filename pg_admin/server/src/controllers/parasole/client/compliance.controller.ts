import { Request, Response } from "express";
import { getContactWithDetails } from "../../../services/parasole/client/about.service";

export const AboutController = {
    getAbout: async (req: Request, res: Response): Promise<void> => {
        try {
            const aboutData = await getContactWithDetails();
            
            res.status(200).json({
                success: true,
                message: "About Us data fetched successfully.",
                data: { aboutUs: aboutData }
            });
        } catch (error) {
            console.error("Error fetching About Us data:", error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch About Us data'
            });
        }
    },

    // getBoardContent: async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const boardData = await getBoardContent();
            
    //         res.status(200).json({
    //             success: true,
    //             message: "Board Content data fetched successfully.",
    //             data: { boardContent: boardData }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching Board Content data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch Board Content data'
    //         });
    //     }
    // },

    // getBoardDirector: async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const directors = await getAllBoardDirectors();
            
    //         res.status(200).json({
    //             success: true,
    //             message: "Board Of Director fetched successfully.",
    //             data: { boardDirector: directors }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching Board Of Director data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch Board Of Director'
    //         });
    //     }
    // },

    // // Combined endpoint with concurrent fetching
    // getAllAboutUsData: async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         // Use Promise.all to fetch all data concurrently
    //          // here fetch operations start at the same time and run in parallel for the use of Promise.all()
    //         const [aboutData, activeImpacts, activeMilestone, boardContent, boardDirectors] = await Promise.all([
    //             getAbout(),
    //             getActiveImpacts(),
    //             getActiveMilestone(),
    //             getBoardContent(),
    //             getAllBoardDirectors()
    //         ]);
            
    //         res.status(200).json({
    //             success: true,
    //             message: "All about page data fetched successfully.",
    //             data: {
    //                 aboutUs: aboutData,
    //                 impacts: activeImpacts,
    //                 milestone: activeMilestone,
    //                 boardContent: boardContent,
    //                 boardDirector: boardDirectors
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching about page data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch about page data'
    //         });
    //     }
    // },

    // getCSRWithDetails: async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const csrData = await getAllCSRWithDetails();
            
    //         res.status(200).json({
    //             success: true,
    //             message: "CSR data fetched successfully.",
    //             data: { getCSRWithDetails: csrData }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching CSR data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch CSR data'
    //         });
    //     }
    // }
};

