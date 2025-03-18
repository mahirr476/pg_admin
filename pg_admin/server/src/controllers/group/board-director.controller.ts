import { Request, Response } from "express";
import { upsertBoard, getAllBoards } from "../../services/group/board-director.service";
import { formatDate } from "../../util/dateFormatter";

export const BoardController = {
    // Upsert a board (create or update)
    // upsert: async (req: Request, res: Response) => {
    //     try {
    //         // Check if user exists on the request
    //         const user = (req as any).user;
    //         if (!user) {
    //             return res.status(401).json({
    //                 status: "error",
    //                 message: "Authentication required. User not found in request."
    //             });
    //         }
            
    //         const userId = user.userId;
    //         if (!userId) {
    //             return res.status(401).json({
    //                 status: "error",
    //                 message: "User ID not found in authentication token"
    //             });
    //         }
            
    //         // Get user name with fallback to user ID if first/last name not available
    //         const userName = (user.firstName && user.lastName) 
    //             ? `${user.firstName} ${user.lastName}` 
    //             : `User ${userId}`;
            
    //         // Prepare board data
    //         const data = req.body;
            
    //         // Validate required fields
    //         if (!data.title || !data.description) {
    //             return res.status(400).json({
    //                 status: "error",
    //                 message: "Title and description are required fields."
    //             });
    //         }
            
    //         const boardData = {
    //             ...data,
    //             createdBy: userName,
    //             updatedBy: userName
    //         };
            
    //         // Perform upsert
    //         const board = await upsertBoard(boardData);
            
    //         return res.status(data.id ? 200 : 201).json({
    //             status: "success",
    //             message: data.id ? "Board updated successfully" : "Board created successfully",
    //             board: {
    //                 ...board,
    //                 formattedCreatedAt: formatDate(board.createdAt),
    //                 formattedUpdatedAt: formatDate(board.updatedAt)
    //             }
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: "error",
    //             message: (error as Error).message || "Failed to upsert board"
    //         });
    //     }
    // },


    upsert: async (req: Request, res: Response) => {
        try {
            // Check if user exists on the request
            const user = (req as any).user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request."
                });
            }
           
            const userId = user.userId;
            if (!userId) {
                return res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token"
                });
            }
           
            // Get user name with fallback to user ID if first/last name not available
            const userName = (user.firstName && user.lastName)
                ? `${user.firstName} ${user.lastName}`
                : `User ${userId}`;
           
            // Prepare board data
            const data = req.body;
           
            // Validate required fields
            if (!data.title || !data.description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required fields.",
                });
            }

            // Add the user info to the data
            const boardData = {
                ...data,
                createdBy: userName,
                updatedBy: userName,
            };
           
            // Perform upsert
            const board = await upsertBoard(boardData);
           
            // Format dates for response
            const formattedBoard = {
                ...board,
                createdAt: formatDate(board.createdAt),
                updatedAt: formatDate(board.updatedAt)
            };

            return res.status(data.id ? 200 : 201).json({
                success: true,
                message: data.id ? "Board updated successfully." : "Board created successfully.",
                data: formattedBoard,
            });
        } catch (error) {
            console.error("Error saving board information:", error);
            
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to save board information",
            });
        }
    },

    // Get all boards
    getAll: async (_req: Request, res: Response) => {
        try {
            const board = await getAllBoards();

            if (!board) {
                return res.status(404).json({
                    success: false,
                    message: "Board Content not found.",
                });
            }

            // Format dates
            const formattedData = {
                ...board,
                createdAt: formatDate(board.createdAt),
                updatedAt: formatDate(board.updatedAt)
            };
            res.status(200).json({
                status: "success",
                message: 'Board content fetched successfully',
                data : formattedData,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: (error as Error).message || 'Failed to fetch boards'
            });
        }
    },

    // Get a specific board by ID
    // getById: async (req: Request, res: Response) => {
    //     try {
    //         const { id } = req.params;
    //         const board = await getBoardById(Number(id));
            
    //         if (!board) {
    //             return res.status(404).json({
    //                 status: "error",
    //                 message: `Board with ID ${id} not found`
    //             });
    //         }
            
    //         return res.status(200).json({
    //             status: "success",
    //             message: "Board fetched successfully",
    //             board: {
    //                 ...board,
    //                 formattedCreatedAt: formatDate(board.createdAt),
    //                 formattedUpdatedAt: formatDate(board.updatedAt)
    //             }
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             status: "error",
    //             message: (error as Error).message || "Failed to fetch board"
    //         });
    //     }
    // }
};