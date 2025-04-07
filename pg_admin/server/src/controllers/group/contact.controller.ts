// Add to your controller file or create contact.controller.ts

import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { getContactUs, upsertContactUs } from "../../services/group/contact.service";

export const ContactController = {
  // Get contact information
  getContactInfo: async (req: Request, res: Response): Promise<void> => {
    try {

      // Check authentication
    //   const auth = getAuthenticatedUser(req, res);
    //   if (!auth) return;

      const contact = await getContactUs();
      
      if (!contact) {
        res.status(404).json({
          success: false,
          message: "Contact information not found"
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: "Contact information fetched successfully",
        data: {
          ...contact,
          createdAt: formatDate(contact.createdAt),
          updatedAt: contact.updatedAt ? formatDate(contact.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error fetching contact information:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch contact information"
      });
    }
  },

  // Create or update contact information (admin only)
  updateContactInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { 
        title, 
        description1, 
        description2, 
        location, 
        phone, 
        email, 
        workingHour, 
        googleMap, 
        facebook, 
        instagram, 
        twitter, 
        linkedin 
      } = req.body;
      
      // Validate required fields
      if (!title || !description1 || !location || !phone || !email || !workingHour) {
        res.status(400).json({
          success: false,
          message: 'Required fields are missing'
        });
        return;
      }
      
      // Check if record exists to determine if this is a create or update
      const existingContact = await getContactUs();
      const isNew = !existingContact;
      
      // Create or update contact information
      const contact = await upsertContactUs(
        {
          title,
          description1,
          description2: description2 || '',
          location,
          phone,
          email,
          workingHour,
          googleMap: googleMap || '',
          facebook: facebook || '',
          instagram: instagram || '',
          twitter: twitter || '',
          linkedin: linkedin || ''
        },
        auth.userName
      );
      
      res.status(isNew ? 201 : 200).json({
        success: true,
        message: `Contact information ${isNew ? 'created' : 'updated'} successfully`,
        data: {
          ...contact,
          createdAt: formatDate(contact.createdAt),
          updatedAt: contact.updatedAt ? formatDate(contact.updatedAt) : null
        }
      });
    } catch (error) {
      console.error("Error updating contact information:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to update contact information"
      });
    }
  }
};