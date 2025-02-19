import { Request, Response } from 'express';
import { createWebsite } from '../../services/global/website.service';


export const WebsiteController = {
  // Create a new website
  create: async (req: Request, res: Response) => {
    try {
      const { name, domain, description } = req.body;
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
      res.status(400).json({
        error: (error as Error).message || 'Failed to create website',
      });
    }
  },

  


};