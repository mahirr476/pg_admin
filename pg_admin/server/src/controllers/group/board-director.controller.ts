import { Request, Response } from "express";
import { upsertBoard, getAllBoards } from "../../services/group/board-director.service";
import { formatDate } from "../../util/dateFormatter";
import { group } from '../../config/db.config';

export const BoardController = {
    // Create or update a board
    // upsert: async (req: Request, res: Response): Promise<void> => { 
    //     try { 
    //         // Check if user exists on the request 
    //         const user = (req as any).user; 
    //         if (!user) { 
    //             res.status(401).json({ 
    //                 success: false, 
    //                 message: "Authentication required. User not found in request.", 
    //             }); 
    //             return;
    //         } 
         
    //         const userId = user.userId; 
    //         if (!userId) { 
    //             res.status(401).json({ 
    //                 status: "error", 
    //                 message: "User ID not found in authentication token", 
    //             }); 
    //             return; 
    //         } 
         
    //         // Get user name with fallback to user ID if first/last name not available 
    //         const userName = (user.firstName && user.lastName) 
    //             ? `${user.firstName} ${user.lastName}` 
    //             : `User ${userId}`; 
            
    //         // Import the group database connection
    //         const { group } = require('../../config/db.config');
            
    //         // Check if a board already exists (determines if this is create or update)
    //         const existingBoard = await group.board.findFirst();
    //         const isUpdate = !!existingBoard;
            
    //         // Prepare board data 
    //         const data = req.body; 
            
    //         // Validate required fields 
    //         if (!data.title || !data.description) { 
    //             res.status(400).json({ 
    //                 success: false, 
    //                 message: "Title and description are required fields.", 
    //             }); 
    //             return; 
    //         } 
            
    //         // Add the user info to the data 
    //         const boardData = { 
    //             ...data, 
    //             createdBy: userName, 
    //             updatedBy: userName, 
    //         }; 
            
    //         // Perform upsert 
    //         const board = await upsertBoard(boardData); 
            
    //         // Format dates for response 
    //         const formattedBoard = { 
    //             ...board, 
    //             createdAt: formatDate(board.createdAt), 
    //             updatedAt: formatDate(board.updatedAt), 
    //         }; 
            
    //         res.status(isUpdate ? 200 : 201).json({ 
    //             success: true, 
    //             message: isUpdate ? "Board updated successfully." : "Board created successfully.", 
    //             data: formattedBoard, 
    //         }); 
    //     } catch (error) { 
    //         console.error("Error saving board information:", error); 
            
    //         res.status(500).json({ 
    //             success: false, 
    //             message: (error as Error).message || "Failed to save board information", 
    //         }); 
    //     } 
    // },

    upsert: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check if user exists on the request
            const user = (req as any).user;
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required. User not found in request.",
                });
                return;
            }
    
            const userId = user.userId;
            if (!userId) {
                res.status(401).json({
                    status: "error",
                    message: "User ID not found in authentication token",
                });
                return;
            }
    
            // Get user name with fallback to user ID
            const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${userId}`;


            const existingBoard = await group.board.findFirst();
            const isUpdate = !!existingBoard;
    
            // Extract board data from request
            const data = req.body;
    
            // Validate required fields
            if (!data.title || !data.description) {
                res.status(400).json({
                    success: false,
                    message: "Title and description are required fields.",
                });
                return;
            }
    
            // Add user info to the board data
            const boardData = {
                ...data,
                createdBy: userName,
                updatedBy: userName,
            };
    
            const board = await upsertBoard(boardData);
    
            res.status(isUpdate ? 200 : 201).json({
                success: true,
                message: isUpdate ? "Board updated successfully." : "Board created successfully.",
                data: board,
            });
        } catch (error) {
            console.error("Error saving board information:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to save board information",
            });
        }
    },

    // Get all boards
    getAll: async (_req: Request, res: Response): Promise<void> => {
        try {
            const board = await getAllBoards();
    
            if (!board) {
                res.status(404).json({
                    success: false,
                    message: "Board Content not found.",
                });
                return;
            }
    
            // Format dates
            const formattedData = {
                ...board,
                createdAt: formatDate(board.createdAt),
                updatedAt: formatDate(board.updatedAt),
            };
    
            res.status(200).json({
                status: "success",
                message: "Board content fetched successfully",
                data: formattedData,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: (error as Error).message || "Failed to fetch boards",
            });
        }
    },

    // getAll: async (_req: Request, res: Response) => {
    //     try {
    //         const board = await getAllBoards();

    //         if (!board) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Board Content not found.",
    //             });
    //         }

    //         // Format dates
    //         const formattedData = {
    //             ...board,
    //             createdAt: formatDate(board.createdAt),
    //             updatedAt: formatDate(board.updatedAt)
    //         };
    //         res.status(200).json({
    //             status: "success",
    //             message: 'Board content fetched successfully',
    //             data : formattedData,
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             status: "error",
    //             message: (error as Error).message || 'Failed to fetch boards'
    //         });
    //     }
    // },

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