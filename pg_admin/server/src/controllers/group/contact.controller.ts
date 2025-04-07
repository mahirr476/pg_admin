import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { createContactUsForm, deleteContactUsForm, getAllContactUsForms, getContactUs, upsertContactUs } from "../../services/group/contact.service";
import { containsMaliciousContent, isRateLimited, isValidEmail, isValidPhone } from "../../util/validation.utils";

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
  },


  // =========================== CONTACT US FROM CONTROLLERS ===========================


  // Submit a new contact form (public endpoint)
  submitContactForm: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get client IP for rate limiting
      const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      
      // Check rate limiting
      if (isRateLimited(clientIp)) {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
        return;
      }
      
      // Validate required fields
      const { name, organization, email, phone, message } = req.body;
      
      if (!name || !organization || !email || !phone || !message) {
        res.status(400).json({
          success: false,
          message: 'All fields are required: name, organization, email, phone, and message.'
        });
        return;
      }
      
      // Validate email format
      if (!isValidEmail(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.'
        });
        return;
      }
      
      // Validate phone format
      if (!isValidPhone(phone)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid phone number.'
        });
        return;
      }
      
      // Check for malicious content
      if (
        containsMaliciousContent(name) || 
        containsMaliciousContent(organization) || 
        containsMaliciousContent(email) || 
        containsMaliciousContent(message)
      ) {
        res.status(400).json({
          success: false,
          message: 'Your submission contains invalid content.'
        });
        return;
      }
      
      // Validate message length
      if (message.length < 10) {
        res.status(400).json({
          success: false,
          message: 'Message is too short. Please provide more details.'
        });
        return;
      }
      
      if (message.length > 5000) {
        res.status(400).json({
          success: false,
          message: 'Message is too long. Please limit to 5000 characters.'
        });
        return;
      }
      
      // Create contact form submission
      const contact = await createContactUsForm({
        name,
        organization,
        email,
        phone,
        message
      });
      
      res.status(201).json({
        success: true,
        message: "Thank you for your message. We will contact you soon.",
        // data: {
        //   id: contact.id
        // }
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit your message. Please try again later."
      });
    }
  },

  // Get all contact form submissions (admin only)
  getAllContactForms: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const forms = await getAllContactUsForms();
      
      res.status(200).json({
        success: true,
        message: "Contact form submissions fetched successfully",
        data: forms.map(form => ({
          ...form,
          createdAt: formatDate(form.createdAt)
        }))
      });
    } catch (error) {
      console.error("Error fetching contact form submissions:", error);
      res.status(500).json({
        success: false,
        message: (error as Error).message || "Failed to fetch contact form submissions"
      });
    }
  },

   // Delete a contact form submission (admin only)
   deleteContactForm: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Form submission ID is required',
        });
        return;
      }
      
      const formId = parseInt(id);
      if (isNaN(formId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }
      
      await deleteContactUsForm(formId);
      
      res.status(200).json({
        success: true,
        message: "Contact form submission deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting contact form submission:", error);
      
      const status = (error as Error).message.includes('not found') ? 404 : 500;
      
      res.status(status).json({
        success: false,
        message: (error as Error).message || "Failed to delete contact form submission"
      });
    }
  }

};