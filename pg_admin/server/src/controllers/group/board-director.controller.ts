import { Request, Response } from "express";
import { upsertBoard, getAllBoards, createBoardDirector, getAllBoardDirectors, deleteBoardDirector } from "../../services/group/board-director.service";
import { formatDate } from "../../util/dateFormatter";
import { group } from '../../config/db.config';
import { createUploadMiddleware, UPLOAD_PATHS, uploadDirectorImage } from "../../middleware/upload.middleware";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { getAuthenticatedUser } from "../..//util/auth.utils";



// const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads', 'group', 'directors');
// const UPLOAD_DIR = "D:/Devlopment/pg_admin/pg_admin/server/public/uploads/group/directors";
// const UPLOAD_DIR = "/app/public/uploads/group/directors";

// // Ensure upload directory exists
// if (!fs.existsSync(UPLOAD_DIR)) {
//     fs.mkdirSync(UPLOAD_DIR, { recursive: true });
//     console.log(`Created upload directory: ${UPLOAD_DIR}`);
//   }

// // Configure multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, UPLOAD_DIR);
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       const ext = path.extname(file.originalname);
//       cb(null, `director-${uniqueSuffix}${ext}`);
//     },
//   });

//   // Initialize multer upload
// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//       if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//       } else {
//         cb(new Error('Only JPEG, PNG, and GIF files are allowed.'));
//       }
//     }
//   }).single('image');

export const BoardController = {
    // Create or update a board
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

    // Create a new board director
  //   createDirector: async (req: Request, res: Response) => {
  //     try {
  //       // Handle file upload
  //       await new Promise((resolve, reject) => {
  //         upload(req, res, (err) => {
  //           if (err instanceof multer.MulterError) {
  //             return reject({ status: 400, message: 'File upload error.', error: err.message });
  //           } else if (err) {
  //             return reject({ status: 500, message: 'Internal server error during file upload.', error: err.message });
  //           }
  //           resolve(true);
  //         });
  //       });

  //       // Check if user exists on the request
  //       const user = (req as any).user;
  //       if (!user) {
  //         return res.status(401).json({
  //           success: false,
  //           message: 'Authentication required. User not found in request.',
  //         });
  //       }

  //       const userId = user.userId;
  //       if (!userId) {
  //         return res.status(401).json({
  //           success: false,
  //           message: 'User ID not found in authentication token',
  //         });
  //       }

  //       // Get user name with fallback to user ID
  //       const userName = user.firstName && user.lastName 
  //         ? `${user.firstName} ${user.lastName}` 
  //         : `User ${userId}`;

  //       const data = req.body;

  //       // Validate required fields
  //       if (!data.name || !data.designation || !data.shortDescription || !data.longDescription) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Name, designation, short description, and long description are required fields.',
  //         });
  //       }

  //       // Set image path if file uploaded
  //       let imagePath = 'default-director.jpg';
  //       if (req.file) {
  //         imagePath = `uploads/group/directors/${req.file.filename}`;
  //       }

  //       // Create the new director
  //       const directorData = {
  //         ...data,
  //         image: imagePath,
  //         createdBy: userName,
  //         updatedBy: userName
  //       };

  //       const director = await createBoardDirector(directorData);

  //       return res.status(201).json({
  //         success: true,
  //         message: 'Board director created successfully.',
  //         data: {
  //           ...director,
  //           createdAt: formatDate(director.createdAt),
  //           updatedAt: formatDate(director.updatedAt),
  //           imageUrl: director.image ? `/${director.image}` : null
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error creating board director:', error);
        
  //       // Handle different error types
  //       if (typeof error === 'object' && error !== null && 'status' in error) {
  //         return res.status((error as any).status).json({
  //           success: false,
  //           message: (error as any).message,
  //           error: (error as any).error
  //         });
  //       }
        
  //       return res.status(500).json({
  //         success: false,
  //         message: (error as Error).message || 'Failed to create board director',
  //       });
  //     }
  //   },

  // // Update board director
  //   updateDirector: async (req: Request, res: Response) => {
  //     try {
  //       // Handle file upload
  //       await new Promise((resolve, reject) => {
  //         upload(req, res, (err) => {
  //           if (err instanceof multer.MulterError) {
  //             return reject({ status: 400, message: 'File upload error.', error: err.message });
  //           } else if (err) {
  //             return reject({ status: 500, message: 'Internal server error during file upload.', error: err.message });
  //           }
  //           resolve(true);
  //         });
  //       });

  //       // Check if user exists on the request
  //       const user = (req as any).user;
  //       if (!user) {
  //         return res.status(401).json({
  //           success: false,
  //           message: 'Authentication required. User not found in request.',
  //         });
  //       }

  //       const userId = user.userId;
  //       if (!userId) {
  //         return res.status(401).json({
  //           success: false,
  //           message: 'User ID not found in authentication token',
  //         });
  //       }

  //       // Get user name with fallback to user ID
  //       const userName = user.firstName && user.lastName 
  //         ? `${user.firstName} ${user.lastName}` 
  //         : `User ${userId}`;

  //       const { id } = req.params;
  //       const directorId = parseInt(id, 10);
        
  //       if (isNaN(directorId)) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Invalid director ID.',
  //         });
  //       }

  //       // Get existing director to check if it exists
  //       const existingDirector = await group.boardOfDirector.findUnique({
  //         where: { id: directorId }
  //       });

  //       if (!existingDirector) {
  //         return res.status(404).json({
  //           success: false,
  //           message: `Director with ID ${directorId} not found.`,
  //         });
  //       }

  //       const data = req.body;

  //       // Validate required fields
  //       if (!data.name || !data.designation || !data.shortDescription || !data.longDescription) {
  //         return res.status(400).json({
  //           success: false,
  //           message: 'Name, designation, short description, and long description are required fields.',
  //         });
  //       }

  //       // Parse orderIndex if provided
  //       let orderIndex = existingDirector.orderIndex;
  //       if (data.orderIndex) {
  //         orderIndex = parseInt(data.orderIndex, 10);
          
  //         // Check if this specific orderIndex is already used by another director
  //         if (orderIndex !== existingDirector.orderIndex) {
  //           const directorWithSameOrder = await group.boardOfDirector.findUnique({
  //             where: {
  //               orderIndex: orderIndex
  //             }
  //           });
            
  //           if (directorWithSameOrder && directorWithSameOrder.id !== directorId) {
  //             return res.status(400).json({
  //               success: false,
  //               message: `A director with order index ${orderIndex} already exists. Please use a different order index.`,
  //             });
  //           }
  //         }
  //       }

  //       // Set image path
  //       let imagePath = existingDirector.image;
  //       if (req.file) {
  //         // Set new image path
  //         imagePath = `uploads/group/directors/${req.file.filename}`;
          
  //         // Delete old image if it exists and isn't the default
  //         if (existingDirector.image && existingDirector.image !== 'default-director.jpg') {
  //           try {
  //             // Get just the filename from the path
  //             const oldImageFilename = path.basename(existingDirector.image);
  //             const oldImagePath = path.join(UPLOAD_DIR, oldImageFilename);
              
  //             if (fs.existsSync(oldImagePath)) {
  //               fs.unlinkSync(oldImagePath);
  //               console.log(`Deleted old image: ${oldImagePath}`);
  //             }
  //           } catch (err) {
  //             console.error("Error deleting old image:", err);
  //             // Continue with update even if deleting fails
  //           }
  //         }
  //       }

  //       // Update the director
  //       const updatedDirector = await group.boardOfDirector.update({
  //         where: { id: directorId },
  //         data: {
  //           name: data.name,
  //           designation: data.designation,
  //           orderIndex: orderIndex,
  //           image: imagePath,
  //           shortDescription: data.shortDescription,
  //           longDescription: data.longDescription,
  //           updatedBy: userName,
  //           status: data.status
  //           // updatedAt: new Date()
  //         }
  //       });

  //       return res.status(200).json({
  //         success: true,
  //         message: 'Board director updated successfully.',
  //         data: {
  //           ...updatedDirector,
  //           createdAt: formatDate(updatedDirector.createdAt),
  //           updatedAt: formatDate(updatedDirector.updatedAt),
  //           imageUrl: updatedDirector.image ? `/${updatedDirector.image}` : null
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error updating board director:', error);
        
  //       // Handle different error types
  //       if (typeof error === 'object' && error !== null && 'status' in error) {
  //         return res.status((error as any).status).json({
  //           success: false,
  //           message: (error as any).message,
  //           error: (error as any).error
  //         });
  //       }
        
  //       return res.status(500).json({
  //         success: false,
  //         message: (error as Error).message || 'Failed to update board director',
  //       });
  //     }
  //   },

  //   getAllDirector: async (req: Request, res: Response): Promise<void> => {
  //     try {
  //       const directors = await getAllBoardDirectors();
        
  //       res.status(200).json({
  //         success: true,
  //         message: 'Board directors fetched successfully.',
  //         data: directors.map(director => ({
  //           ...director,
  //           createdAt: formatDate(director.createdAt),
  //           updatedAt: formatDate(director.updatedAt),
  //           // imageUrl: director.image ? `/${director.image}` : null
  //         })),
  //       });
  //     } catch (error) {
  //       console.error('Error fetching board directors:', error);
  //       res.status(500).json({
  //         success: false,
  //         message: (error as Error).message || 'Failed to fetch board directors',
  //       });
  //     }
  //   },

  //   // Delete a Director
  //   deleteDirector: async (req: Request, res: Response): Promise<void> => {
  //     try {
  //         // Check authentication
  //         const auth = getAuthenticatedUser(req, res);
  //         if (!auth) return;

  //         const { id } = req.params;

  //         // Convert ID to number
  //         const directorId = parseInt(id);
  //         if (isNaN(directorId)) {
  //             res.status(400).json({
  //                 success: false,
  //                 message: "Invalid ID format"
  //             });
  //             return;
  //         }

  //         await deleteBoardDirector(directorId);

  //         res.status(200).json({
  //             success: true,
  //             message: "Board Of Director deleted successfully"
  //         });
  //     } catch (error) {
  //         console.error("Error deleting Board Of Director:", error);

  //         const status = (error as Error).message.includes('not found') ? 404 : 500;

  //         res.status(status).json({
  //             success: false,
  //             message: (error as Error).message || "Failed to delete Board Of Director"
  //         });
  //     }
  //   }


    // Create a new board director
    createDirector: async (req: Request, res: Response) => {
        uploadDirectorImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePath: string = '';

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                // Get uploaded file
                const file = req.file;
                imagePath = file 
                    ? `${UPLOAD_PATHS.DIRECTORS_IMAGES || 'public/uploads/group/directors'}/${file.filename}`
                    : 'default-director.jpg';

                const { name, designation, shortDescription, longDescription, orderIndex } = req.body;

                // Validate required fields
                if (!name || !designation || !shortDescription || !longDescription) {
                    throw new Error("Name, designation, short description, and long description are required fields.");
                }

                // Convert orderIndex to a number if provided
                let orderNum = undefined;
                if (orderIndex !== undefined) {
                    orderNum = parseInt(orderIndex);
                    if (isNaN(orderNum)) {
                        throw new Error('Order index must be a valid number');
                    }
                }

                // Create the new Director
                const directorData = {
                    name,
                    designation,
                    shortDescription,
                    longDescription,
                    orderIndex: orderNum,
                    image: imagePath,
                    createdBy: auth.userName,
                };

                const director = await createBoardDirector(directorData);

                res.status(201).json({
                    success: true,
                    message: "Board director created successfully",
                    data: {
                        ...director,
                        createdAt: formatDate(director.createdAt),
                        updatedAt: director.updatedAt ? formatDate(director.updatedAt) : null,
                    },
                });

                // Clear image path after successful creation
                imagePath = '';
            } catch (error) {
                // Delete uploaded image if an error occurs
                deleteUploadedFile(imagePath);

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('unique')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message,
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to create board director",
                });
            }
        });
    },

    // Get a director by ID
    getByIdDirector: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid director ID"
                });
                return;
            }

            const director = await group.boardOfDirector.findUnique({
                where: { id: id }
            });

            if (!director) {
                res.status(404).json({
                    success: false,
                    message: "Director not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Director retrieved successfully",
                data: {
                    ...director,
                    createdAt: formatDate(director.createdAt),
                    updatedAt: director.updatedAt ? formatDate(director.updatedAt) : null
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve director"
            });
        }
    },

    // Get all directors  
    getAllDirector: async (req: Request, res: Response): Promise<void> => {
        try {
            const directors = await getAllBoardDirectors();
            
            res.status(200).json({
                success: true,
                message: "Directors retrieved successfully",
                data: directors.map(director => ({
                    ...director,
                    createdAt: formatDate(director.createdAt),
                    updatedAt: director.updatedAt ? formatDate(director.updatedAt) : null
                }))
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve directors"
            });
        }
    },

    // Update a director
    updateDirector: async (req: Request, res: Response): Promise<void> => {
        uploadDirectorImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePath: string = '';

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid director ID"
                    });
                    return;
                }

                // Check if director exists
                const existingDirector = await group.boardOfDirector.findUnique({
                    where: { id: id }
                });

                if (!existingDirector) {
                    res.status(404).json({
                        success: false,
                        message: "Director not found"
                    });
                    return;
                }

                const { name, designation, shortDescription, longDescription, orderIndex, status } = req.body;
                
                // Get uploaded file
                const file = req.file;
                imagePath = file 
                    ? `${UPLOAD_PATHS.DIRECTORS_IMAGES || 'public/uploads/group/directors'}/${file.filename}`
                    : '';
                
                // Prepare update data
                const updateData: any = {
                    updatedBy: auth.userName
                };

                // Only update provided fields
                if (name !== undefined) updateData.name = name;
                if (designation !== undefined) updateData.designation = designation;
                if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
                if (longDescription !== undefined) updateData.longDescription = longDescription;
                if (status !== undefined) updateData.status = status;
                if (orderIndex !== undefined) {
                    const orderNum = parseInt(orderIndex);
                    if (isNaN(orderNum)) {
                        res.status(400).json({
                            success: false,
                            message: 'Order index must be a valid number',
                        });
                        return;
                    }
                    updateData.orderIndex = orderNum;
                }

                // Handle image update if provided
                let oldImagePath: string = '';
                if (file) {
                    // Store old image path for deletion later
                    oldImagePath = existingDirector.image || '';
                    updateData.image = imagePath;
                }

                // Update the director
                const updatedDirector = await group.boardOfDirector.update({
                    where: { id: id },
                    data: updateData
                });

                // If update successful and we have new image, delete the old one
                if (oldImagePath && oldImagePath !== 'default-director.jpg') {
                    try {
                        fs.unlinkSync(path.resolve(oldImagePath));
                    } catch (e) {
                        console.error("Failed to delete old image file:", e);
                    }
                }

                res.status(200).json({
                    success: true,
                    message: "Director updated successfully",
                    data: {
                        ...updatedDirector,
                        createdAt: formatDate(updatedDirector.createdAt),
                        updatedAt: updatedDirector.updatedAt ? formatDate(updatedDirector.updatedAt) : null
                    }
                });
                
                // Clear image path after successful update
                imagePath = '';
            } catch (error) {
                // Delete uploaded image if an error occurs
                deleteUploadedFile(imagePath);

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('unique')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message
                    });
                    return;
                }
                
                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to update director"
                });
            }
        });
    },

    // Delete a director
    deleteDirector: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid director ID"
                });
                return;
            }

            // Check if director exists and get image path
            const existingDirector = await group.boardOfDirector.findUnique({
                where: { id: id }
            });

            if (!existingDirector) {
                res.status(404).json({
                    success: false,
                    message: "Director not found"
                });
                return;
            }

            // Store image path for deletion later
            const imagePath = existingDirector.image || '';

            // Delete the director from the database
            await deleteBoardDirector(id);

            // Delete the image file
            if (imagePath && imagePath !== 'default-director.jpg') {
                try {
                    fs.unlinkSync(path.resolve(imagePath));
                } catch (e) {
                    console.error("Failed to delete image file:", e);
                }
            }

            res.status(200).json({
                success: true,
                message: "Director deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete director"
            });
        }
    },
};

// Helper function to delete uploaded file (same pattern as hero)
const deleteUploadedFile = (filePath: string): void => {
    try {
        if (filePath && filePath !== 'default-director.jpg') {
            fs.unlinkSync(path.resolve(filePath));
        }
    } catch (e) {
        console.error("Failed to delete image file:", e);
    }
};
