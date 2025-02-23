import { Request, Response } from 'express';
import { 
    createWebsite,
    getAllWebsites, 
    getWebsiteById, 
    updateWebsite,
} from '../../services/global/website.service';


export const WebsiteController = {
  // Create a new website
  create: async (req: Request, res: Response) => {
    try {
        const { name, domain, description } = req.body;
        
        // Validate required fields
        if (!name || !domain) {
          res.status(400).json({ error: 'Name and domain are required' });
          return;
        }
        const website = await createWebsite({ name, domain, description });
        res.status(201).json({ 
            status: "success",
            message: 'Website created successfully', 
            website: {
                id: website.id,
                name: website.name,
                domain: website.domain,
                description: website.description,
            }
        });
    } catch (error) {
      // console.error('Error creating website:', error);
      res.status(400).json({
        error: (error as Error).message || 'Failed to create website',
      });
    }
  },

  // Get all websites
  getAll: async (req: Request, res: Response) => {
    try {
        const websites = await getAllWebsites();
        res.status(200).json({ 
            status: "success",
            message: 'Websites fetched successfully', 
            websites: websites.map((website) => ({
                id: website.id,
                name: website.name,
                domain: website.domain,
                description: website.description,
                status: website.status,
            })),
        });
    } catch (error) {
        // console.error('Error fetching websites:', error);
        res.status(500).json({ 
            error: (error as Error).message || 'Failed to fetch websites' 
        });
    }
  },

  // Get a website by ID
  getById: async (req: Request, res: Response) => {
      try {
          const { id } = req.params;
          const website = await getWebsiteById(Number(id));
          res.status(200).json({
              status: "success",
              message: 'getWebsiteById fetched successfully',
              website: {
                  id: website.id,
                  name: website.name,
              },
          });
      } catch (error) {
          res.status(404).json({
              error: (error as Error).message || 'Role not found.',
          });
      }
  },

 // Update a website
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedWebsite = await updateWebsite(Number(id), req.body);
      res.status(200).json({ 
        status: "success",
        message: 'Website updated successfully', 
        website:
        {
          id: updatedWebsite.id,
          name: updatedWebsite.name,
          domain: updatedWebsite.domain,
          description: updatedWebsite.description,
        } 
    });
    } catch (error) {
        // console.error('Error fetching websites:', error);
      res.status(400).json({ 
        error: (error as Error).message || 'Failed to update website' });
    }
  },




};