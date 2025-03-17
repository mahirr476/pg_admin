import { getAbout, upsertAbout } from "../../services/group/about.service";
import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import multer from 'multer';
import fs from 'fs';
import path from 'path';


// Get the upload directory from environment variables or use a fallback
// const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads', 'group', 'about');
const UPLOAD_DIR = "D:/Devlopment/pg_admin/pg_admin/server/public/uploads/group/about";

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // Create the directory and any necessary parent directories
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
}

// Configure multer storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory where images will be stored
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename for the uploaded image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

// Initialize multer with the storage configuration
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Allow only image files
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and GIF files are allowed.'));
        }
    }
}).single('image'); // Field name for the image file

export const AboutController = {

    // Get about information
    

    // Create or update about information
    // upsert: async (req: Request, res: Response) => {
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
    //             // Fallback to userId if names are not available
    //             userName = `User ${userId}`;
    //         }
            
    //         // Validate required fields
    //         if(!data.title || !data.description || !data.mission || !data.vision || !data.about) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title, description, mission, vision, and about are required fields.",
    //             });
    //         }
            
    //         // Add the user info to the data
    //         const aboutData = {
    //             ...data,
    //             createdBy: userName,
    //             updatedBy: userName
    //         };
            
    //         const about = await upsertAbout(aboutData);
            
    //         // Format dates for response
    //         const formattedAbout = {
    //             ...about,
    //             createdAt: formatDate(about.createdAt),
    //             updatedAt: formatDate(about.updatedAt)
    //         };
            
    //         // Get existing record to determine if this was a create or update
    //         const existingAbout = await getAbout();
    //         const isNewRecord = !existingAbout || existingAbout.id === about.id;
            
    //         return res.status(isNewRecord ? 201 : 200).json({
    //             success: true,
    //             message: isNewRecord ? "About information created successfully." : "About information updated successfully.",
    //             data: formattedAbout,
    //         });
    //     } catch (error) {
    //         console.error("Error saving about information:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message || "Failed to save about information",
    //         });
    //     }
    // },

    // Create or update about information
    // upsert: async (req: Request, res: Response) => {
    //     try {
    //         // Handle file upload
    //         await new Promise((resolve, reject) => {
    //             upload(req, res, (err) => {
    //                 if (err instanceof multer.MulterError) {
    //                     return reject({ status: 400, message: "File upload error.", error: err.message });
    //                 } else if (err) {
    //                     return reject({ status: 500, message: "Internal server error during file upload.", error: err.message });
    //                 }
    //                 resolve(true);
    //             });
    //         });

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

    //         // Validate required fields
    //         if (!data.title || !data.description || !data.mission || !data.vision || !data.about) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Title, description, mission, vision, and about are required fields.",
    //             });
    //         }

    //         // Add the uploaded image path to the data
    //         if (req.file) {
    //             data.image = req.file.path; // Store the file path
    //         }

    //         // Add the user info to the data
    //         const aboutData = {
    //             ...data,
    //             createdBy: userName,
    //             updatedBy: userName,
    //         };

    //         const about = await upsertAbout(aboutData);

    //         // Format dates for response
    //         const formattedAbout = {
    //             ...about,
    //             createdAt: formatDate(about.createdAt),
    //             updatedAt: formatDate(about.updatedAt),
    //         };

    //         // Get existing record to determine if this was a create or update
    //         const existingAbout = await getAbout();
    //         const isNewRecord = !existingAbout || existingAbout.id === about.id;

    //         return res.status(isNewRecord ? 201 : 200).json({
    //             success: true,
    //             message: isNewRecord ? "About information created successfully." : "About information updated successfully.",
    //             data: formattedAbout,
    //         });
    //     } catch (error) {
    //         console.error("Error saving about information:", error);
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message || "Failed to save about information",
    //         });
    //     }
    // },


    // Create or update about information
    upsert: async (req: Request, res: Response) => {
        try {
            // Handle file upload
            await new Promise((resolve, reject) => {
                upload(req, res, (err) => {
                    if (err instanceof multer.MulterError) {
                        return reject({ status: 400, message: "File upload error.", error: err.message });
                    } else if (err) {
                        return reject({ status: 500, message: "Internal server error during file upload.", error: err.message });
                    }
                    resolve(true);
                });
            });

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

            // Validate required fields
            if (!data.title || !data.description || !data.mission || !data.vision || !data.about) {
                return res.status(400).json({
                    success: false,
                    message: "Title, description, mission, vision, and about are required fields.",
                });
            }

            // Get existing about data to check for existing image
            const existingAbout = await getAbout();
            
            // Handle image processing
            let imagePath = existingAbout?.image; // Default to existing image path
            
            // If a new file was uploaded, update the image path and delete old file if it exists
            if (req.file) {
                // Store the relative path for the database
                // This will be something like "uploads/group/about/image-123456789.jpg"
                imagePath = `uploads/group/about/${req.file.filename}`;
                
                // Delete old image if it exists and is different from default
                if (existingAbout?.image && existingAbout.image !== 'default-image.jpg') {
                    try {
                        // Construct full path to old image
                        const oldImagePath = path.join(UPLOAD_DIR, path.basename(existingAbout.image));
                        if (fs.existsSync(oldImagePath)) {
                            fs.unlinkSync(oldImagePath);
                            console.log(`Deleted old image: ${oldImagePath}`);
                        }
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                        // Continue with update even if deleting fails
                    }
                }
            }

            // Add the user info and image path to the data
            const aboutData = {
                ...data,
                image: imagePath,
                createdBy: userName,
                updatedBy: userName,
            };

            const about = await upsertAbout(aboutData);

            // Format dates for response
            const formattedAbout = {
                ...about,
                createdAt: formatDate(about.createdAt),
                updatedAt: formatDate(about.updatedAt),
                // Provide a URL for the frontend
                imageUrl: about.image ? `/${about.image}` : null
            };

            return res.status(existingAbout ? 200 : 201).json({
                success: true,
                message: existingAbout ? "About information updated successfully." : "About information created successfully.",
                data: formattedAbout,
            });
        } catch (error) {
            console.error("Error saving about information:", error);
            
            // Handle different error types
            if (typeof error === 'object' && error !== null && 'status' in error) {
                return res.status((error as any).status).json({
                    success: false,
                    message: (error as any).message,
                    error: (error as any).error
                });
            }
            
            return res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to save about information",
            });
        }
    },

    
};