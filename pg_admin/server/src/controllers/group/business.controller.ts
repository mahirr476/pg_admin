import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { uploadBusinessFiles, UPLOAD_PATHS } from "../../middleware/upload.middleware";
import { createBusiness } from "../../services/group/business.service";

export const BusinessController = {
    // Create a new business
    businessCreate: async (req: Request, res: Response): Promise<void> => {
        // Handle both banner and additional image uploads in one middleware
        uploadBusinessFiles(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading files:', err);
                res.status(400).json({
                    success: false,
                    message: 'File upload failed: ' + err.message,
                });
                return;
            }

            try {
                // Check for banner image (required)
                const files = (req as any).files;
                if (!files || !files.bannerImage || files.bannerImage.length === 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Banner image is required',
                    });
                    return;
                }

                // Get the banner image path
                const bannerFile = files.bannerImage[0];
                const bannerImagePath = `${UPLOAD_PATHS.BUSINESS_BANNER_IMAGES}/${bannerFile.filename}`;

                // Check if user exists on the request
                const user = (req as any).user;
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'Authentication required. User not found in request.',
                    });
                    return;
                }
                
                const userId = user.userId;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'User ID not found in authentication token',
                    });
                    return;
                }
                
                // Get user name
                const userName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `User ${userId}`;
                
                const data = req.body;
                
                // Validate required fields
                if (!data.title || !data.shortDes || !data.longDes) {
                    res.status(400).json({
                        success: false,
                        message: 'Title, short description, and long description are required fields.',
                    });
                    return;
                }
                
                // Get the additional image path if uploaded
                let imagePath: string | undefined = undefined;
                if (files.image && files.image.length > 0) {
                    const imageFile = files.image[0];
                    imagePath = `${UPLOAD_PATHS.BUSINESS_IMAGES}/${imageFile.filename}`;
                }
                
                // Create the new business
                const formattedData = {
                    title: data.title,
                    bannerImage: bannerImagePath,
                    slug: data.slug || '', // Use empty string if not provided, it will be generated in service
                    shortDes: data.shortDes,
                    longDes: data.longDes,
                    videoLink: data.videoLink || undefined,
                    image: imagePath,
                    createdBy: userName
                };
                
                const business = await createBusiness(formattedData);
                
                res.status(201).json({
                    success: true,
                    message: "Business created successfully",
                    data: {
                        ...business,
                        createdAt: formatDate(business.createdAt),
                        updatedAt: business.updatedAt ? formatDate(business.updatedAt) : null,
                        // Add image URLs for frontend
                        bannerImageUrl: business.bannerImage ? `/${business.bannerImage}` : null,
                        imageUrl: business.image ? `/${business.image}` : null
                    }
                });
            } catch (error) {
                console.error("Error creating business:", error);
                
                if ((error as Error).message.includes('already exists')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message
                    });
                    return;
                }
                
                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to create business"
                });
            }
        });
    },
};