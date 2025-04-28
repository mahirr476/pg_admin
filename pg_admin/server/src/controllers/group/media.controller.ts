// controllers/group/media.controller.ts
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { 
    // Media services
  createMedia, 
  getAllMedia, 
  updateMedia, 
  deleteMedia,
  
   // Gallery services
   createGallery,
   getAllGalleries,
   updateMediaGallery,
   deleteGallery,

    // News services
   createNews,
   getAllNews,
   updateNews,
   deleteNews,
   getMediaInquery,

   upsertMediaInquery,
   getAllMediaContacts,
   deleteMediaContact
} from "../../services/group/media.service";
import { UpdateGalleryInput, UpdateMediaInput, UpdateNewsInput } from "../../types/media.types";
import { UPLOAD_PATHS, uploadMediaGalleryImage, uploadMediaNewsImage } from "../../middleware/upload.middleware";
import { containsMaliciousContent, isRateLimited, isValidEmail, isValidPhone } from "../../util/validation.utils";

export const MediaController = {
  // Create a new media entry
  createMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return; 
      
      const { title, orderIndex, description } = req.body;
      
      // Validate required fields
      if (!title || orderIndex === undefined || !description) {
        res.status(400).json({
          success: false,
          message: 'Title, order index, and description are required fields.',
        });
        return;
      }
      
      // Convert orderIndex to a number
      const orderIndexNum = parseInt(orderIndex);
      if (isNaN(orderIndexNum)) {
        res.status(400).json({
          success: false,
          message: 'Order index must be a valid number',
        });
        return;
      }
      
      // Create the new media
      const media = await createMedia({
        title,
        orderIndex: orderIndexNum,
        description,
        createdBy: auth.userName
      });
      
      res.status(201).json({
        success: true,
        message: "Media created successfully",
        data: {
          ...media,
          createdAt: formatDate(media.createdAt),
          updatedAt: media.updatedAt ? formatDate(media.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error creating media:", error);
      
      if ((error as Error).message.includes('already exists')) {
        res.status(400).json({
          success: false,
          message: (error as Error).message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to create media"
      });
    }
  },

  // Get all media entries
  getAllMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return; 
      
      const mediaList = await getAllMedia();
      
      res.status(200).json({
        success: true,
        message: "Media fetched successfully",
        data: mediaList.map(item => ({
          id: item.id,
          title: item.title,
          orderIndex: item.orderIndex,
          description: item.description,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: formatDate(item.createdAt),
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media"
      });
    }
  },

  // Update a media entry
  updateMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media ID is required',
        });
        return;
      }
      
      const mediaId = parseInt(id);
      if (isNaN(mediaId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      // Prepare update data
      const updateData: UpdateMediaInput = {
        updatedBy: auth.userName
      };
      
      // Add basic fields from request body
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.status) updateData.status = req.body.status;
      
      // Handle orderIndex specifically to convert to number
      if (req.body.orderIndex !== undefined) {
        const orderIndexNum = parseInt(req.body.orderIndex);
        if (isNaN(orderIndexNum)) {
          res.status(400).json({
            success: false,
            message: 'Order index must be a valid number',
          });
          return;
        }
        updateData.orderIndex = orderIndexNum;
      }
      
      // Update the media
      const updatedMedia = await updateMedia(mediaId, updateData);
      
      res.status(200).json({
        success: true,
        message: "Media updated successfully",
        data: {
          ...updatedMedia,
          createdAt: formatDate(updatedMedia.createdAt),
          updatedAt: updatedMedia.updatedAt ? formatDate(updatedMedia.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error updating media:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 
                    (error as Error).message.includes('already exists') ? 400 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to update media"
      });
    }
  },

  // Delete a media entry
  deleteMedia: async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Media ID is required',
        });
        return;
      }
      
      const mediaId = parseInt(id);
      if (isNaN(mediaId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      await deleteMedia(mediaId);
      
      res.status(200).json({
        success: true,
        message: "Media deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting media:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete media"
      });
    }
  },


// ===========================  GALLERY Manage CONTROLLERS ===========================


   // Create a new media gallery
  createGallery: async (req: Request, res: Response): Promise<void> => {
    uploadMediaGalleryImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed: ' + err.message,
        });
        return;
      }

      try {
        // Check authentication
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;
        
        // Check for image (required)
        const file = (req as any).file;
        if (!file) {
          res.status(400).json({
            success: false,
            message: 'Gallery image is required',
          });
          return;
        }

        // Get the image path
        const imagePath = `${UPLOAD_PATHS.MEDIA_GALLERY_IMAGES}/${file.filename}`;
        
        const { title, description, link } = req.body;
        
        // Validate required fields
        if (!title || !description || !link) {
          // Delete the uploaded image since validation failed
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          res.status(400).json({
            success: false,
            message: 'Title, description, and link are required fields.',
          });
          return;
        }
        
        // Create the new media gallery
        try {
          const gallery = await createGallery({
            title,
            description,
            image: imagePath,
            link,
            createdBy: auth.userName
          });
          
          res.status(201).json({
            success: true,
            message: "Media gallery created successfully",
            data: {
              ...gallery,
            //   imageUrl: `/${gallery.image}`,
              createdAt: formatDate(gallery.createdAt),
              updatedAt: gallery.updatedAt ? formatDate(gallery.updatedAt) : null
            }
          });
        } catch (error) {
          // Delete the uploaded image if gallery creation fails
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          throw error; // Re-throw to be caught by outer catch block
        }
      } catch (error) {
        console.error("Error creating media gallery:", error);
        
        if ((error as Error).message.includes('already exists')) {
          res.status(400).json({
            success: false,
            message: (error as Error).message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: (error as Error).message || "Failed to create media gallery"
        });
      }
    });
  },

  // Get all media galleries
  getAllGallery: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const galleries = await getAllGalleries();
      
      res.status(200).json({
        success: true,
        message: "Media Galleries fetched successfully",
        data: galleries.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          image: item.image,
        //   imageUrl: `/${item.image}`,
          link: item.link,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: formatDate(item.createdAt),
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching media galleries:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media galleries"
      });
    }
  },

  // Update a media gallery
  updateGallery: async (req: Request, res: Response): Promise<void> => {
    uploadMediaGalleryImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed: ' + err.message,
        });
        return;
      }

      try {
        // Check authentication
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;
        
        const { id } = req.params;
        
        if (!id) {
          res.status(400).json({
            success: false,
            message: 'Gallery ID is required',
          });
          return;
        }
        
        const galleryId = parseInt(id);
        if (isNaN(galleryId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid ID format',
          });
          return;
        }
        
        // // Get existing gallery to check if it exists
        // const existingGallery = await getMediaGalleryById(galleryId);
        
        // if (!existingGallery) {
        //   res.status(404).json({
        //     success: false,
        //     message: 'Media gallery not found',
        //   });
        //   return;
        // }
        
        // Prepare update data
        const updateData: UpdateGalleryInput = {
          updatedBy: auth.userName
        };
        
        // Add fields from request body
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.link !== undefined) updateData.link = req.body.link;
        if (req.body.status) updateData.status = req.body.status;
        
        // Add image if uploaded
        const file = (req as any).file;
        if (file) {
          const imagePath = `${UPLOAD_PATHS.MEDIA_GALLERY_IMAGES}/${file.filename}`;
          updateData.image = imagePath;
        }
        
        // Update the media gallery
        const updatedGallery = await updateMediaGallery(galleryId, updateData);
        
        res.status(200).json({
          success: true,
          message: "Media gallery updated successfully",
          data: {
            ...updatedGallery,
            // imageUrl: `/${updatedGallery.image}`,
            createdAt: formatDate(updatedGallery.createdAt),
            updatedAt: updatedGallery.updatedAt ? formatDate(updatedGallery.updatedAt) : null
          }
        });
      } catch (error) {
        console.error("Error updating media gallery:", error);
        
        // If a file was uploaded but the update failed, we should delete it
        const file = (req as any).file;
        if (file) {
          try {
            const filePath = path.resolve(`${UPLOAD_PATHS.MEDIA_GALLERY_IMAGES}/${file.filename}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted unused image due to update failure: ${filePath}`);
            }
          } catch (err) {
            console.error('Failed to delete unused image:', err);
          }
        }
        
        const status = (error as Error).message.includes('not found') ? 404 : 
                      (error as Error).message.includes('already exists') ? 400 : 500;
        
        res.status(status).json({
          success: false,
          message: (error as Error).message || "Failed to update media gallery"
        });
      }
    });
  },

  // Delete a media gallery
  deleteGallery: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Gallery ID is required',
        });
        return;
      }
      
      const galleryId = parseInt(id);
      if (isNaN(galleryId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      // Delete the media gallery - the service function will check if it exists
      await deleteGallery(galleryId);
      
      res.status(200).json({
        success: true,
        message: "Media gallery deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting media gallery:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete media gallery"
      });
    }
  },


// =========================== MEDIA NEWS CONTROLLERS ===========================

    // Create a new media news
  createNews: async (req: Request, res: Response): Promise<void> => {
    uploadMediaNewsImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed: ' + err.message,
        });
        return;
      }
  
      try {
        // Check authentication
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;
        
        // Check for image (required)
        const file = (req as any).file;
        if (!file) {
          res.status(400).json({
            success: false,
            message: 'News image is required',
          });
          return;
        }
  
        // Get the image path
        const imagePath = `${UPLOAD_PATHS.MEDIA_NEWS_IMAGES}/${file.filename}`;
        
        const { title, description, link, tag, date } = req.body;
        
        // Validate required fields
        if (!title || !description || !tag || !date) {
          // Delete the uploaded image since validation failed
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          res.status(400).json({
            success: false,
            message: 'Title, description, link, tag, and date are required fields.',
          });
          return;
        }
        
        // Create the new media news
        try {
          const news = await createNews({
            title,
            description,
            image: imagePath,
            link,
            tag,
            date,
            createdBy: auth.userName
          });
          
          res.status(201).json({
            success: true,
            message: "Media news created successfully",
            data: {
              ...news,
            //   imageUrl: `/${news.image}`,
              createdAt: formatDate(news.createdAt),
              updatedAt: news.updatedAt ? formatDate(news.updatedAt) : null
            }
          });
        } catch (error) {
          // Delete the uploaded image if news creation fails
          try {
            fs.unlinkSync(path.resolve(imagePath));
          } catch (e) {
            console.error("Failed to delete image file:", e);
          }
          
          throw error; // Re-throw to be caught by outer catch block
        }
      } catch (error) {
        console.error("Error creating media news:", error);
        
        if ((error as Error).message.includes('already exists')) {
          res.status(400).json({
            success: false,
            message: (error as Error).message
          });
          return;
        }
        
        res.status(500).json({
          success: false,
          message: (error as Error).message || "Failed to create media news"
        });
      }
    });
  },

  // Get all media news
  getAllNews: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const newsList = await getAllNews();
      
      res.status(200).json({
        success: true,
        message: "Media news fetched successfully",
        data: newsList.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          image: item.image,
        //   imageUrl: `/${item.image}`,
          link: item.link,
          tag: item.tag,
          date: item.date,
          status: item.status,
          createdBy: item.createdBy,
          createdAt: formatDate(item.createdAt),
          updatedBy: item.updatedBy,
          updatedAt: item.updatedAt ? formatDate(item.updatedAt) : null
        }))
      });
    } catch (error) {
      console.error("Error fetching media news:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media news"
      });
    }
  },

  // Update a media news
  updateNews: async (req: Request, res: Response): Promise<void> => {
    uploadMediaNewsImage(req, res, async (err: any) => {
      if (err) {
        console.error('Error uploading image:', err);
        res.status(400).json({
          success: false,
          message: 'Image upload failed: ' + err.message,
        });
        return;
      }
  
      try {
        // Check authentication
        const auth = getAuthenticatedUser(req, res);
        if (!auth) return;
        
        const { id } = req.params;
        
        if (!id) {
          res.status(400).json({
            success: false,
            message: 'News ID is required',
          });
          return;
        }
        
        const newsId = parseInt(id);
        if (isNaN(newsId)) {
          res.status(400).json({
            success: false,
            message: 'Invalid ID format',
          });
          return;
        }
        
        // Prepare update data
        const updateData: UpdateNewsInput = {
          updatedBy: auth.userName
        };
        
        // Add fields from request body
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.link !== undefined) updateData.link = req.body.link;
        if (req.body.tag !== undefined) updateData.tag = req.body.tag;
        if (req.body.date !== undefined) updateData.date = req.body.date;
        if (req.body.status) updateData.status = req.body.status;
        
        // Add image if uploaded
        const file = (req as any).file;
        if (file) {
          const imagePath = `${UPLOAD_PATHS.MEDIA_NEWS_IMAGES}/${file.filename}`;
          updateData.image = imagePath;
        }
        
        // Update the media news - the service function will check if it exists
        const updatedNews = await updateNews(newsId, updateData);
        
        res.status(200).json({
          success: true,
          message: "Media news updated successfully",
          data: {
            ...updatedNews,
            // imageUrl: `/${updatedNews.image}`,
            createdAt: formatDate(updatedNews.createdAt),
            updatedAt: updatedNews.updatedAt ? formatDate(updatedNews.updatedAt) : null
          }
        });
      } catch (error) {
        console.error("Error updating media news:", error);
        
        // If a file was uploaded but the update failed, we should delete it
        const file = (req as any).file;
        if (file) {
          try {
            const filePath = path.resolve(`${UPLOAD_PATHS.MEDIA_NEWS_IMAGES}/${file.filename}`);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted unused image due to update failure: ${filePath}`);
            }
          } catch (err) {
            console.error('Failed to delete unused image:', err);
          }
        }
        
        const status = (error as Error).message.includes('not found') ? 404 : 
                      (error as Error).message.includes('already exists') ? 400 : 500;
        
        res.status(status).json({
          success: false,
          message: (error as Error).message || "Failed to update media news"
        });
      }
    });
  },

  // Delete a media news
  deleteNews: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'News ID is required',
        });
        return;
      }
      
      const newsId = parseInt(id);
      if (isNaN(newsId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      // Delete the media news - the service function will check if it exists
      await deleteNews(newsId);
      
      res.status(200).json({
        success: true,
        message: "Media news deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting media news:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete media news"
      });
    }
  },


  // =========================== MEDIA INQUERY CONTROLLERS ===========================

  // Get the current media inquery
  getInquery: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      // Get existing inquery
      const inquery = await getMediaInquery();
      
      if (!inquery) {
        res.status(404).json({
          success: false,
          message: "No media inquery found"
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: "Media inquery fetched successfully",
        data: {
          ...inquery,
          createdAt: formatDate(inquery.createdAt),
          updatedAt: inquery.updatedAt ? formatDate(inquery.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error fetching media inquery:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media inquery"
      });
    }
  },

  // Create or update media inquery
  handleInquery: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      // Validate fields from request body
      const { title, description, email, contactNo, website } = req.body;
      if (!title || !description || !email || !contactNo || !website) {
        res.status(400).json({
          success: false,
          message: 'All fields are required: title, description, email, contactNo, and website.'
        });
        return;
      }
      
      // Check if record exists to determine if this is a create or update
      const existingInquery = await getMediaInquery();
      const isNew = !existingInquery;
      
      // Upsert the inquiry data
      const result = await upsertMediaInquery(
        { title, description, email, contactNo, website },
        auth.userName
      );
      
      // Success response
      res.status(isNew ? 201 : 200).json({
        success: true,
        message: `Media inquiry ${isNew ? 'created' : 'updated'} successfully`,
        data: {
          ...result,
          createdAt: formatDate(result.createdAt),
          updatedAt: result.updatedAt ? formatDate(result.updatedAt) : null
        }
      });
    } catch (error) {
      console.error('Error handling media inquiry:', error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || 'Failed to process media inquiry'
      });
    }
  }, 
 


  // =========================== MEDIA CONTACT CONTROLLERS ===========================


  // Get all contacts (admin only)
  getAllContacts: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const contacts = await getAllMediaContacts();
      
      res.status(200).json({
        success: true,
        message: "Media contacts fetched successfully",
        data: contacts.map(contact => ({
          ...contact,
          createdAt: formatDate(contact.createdAt)
        }))
      });
    } catch (error) {
      console.error("Error fetching media contacts:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch media contacts"
      });
    }
  },


  // Delete a contact (admin only)
  deleteContact: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Contact ID is required',
        });
        return;
      }
      
      const contactId = parseInt(id);
      if (isNaN(contactId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      await deleteMediaContact(contactId);
      
      res.status(200).json({
        success: true,
        message: "Media contact deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting media contact:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete media contact"
      });
    }
  },

};