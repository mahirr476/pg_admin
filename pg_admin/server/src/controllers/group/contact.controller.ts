import { Request, Response } from "express";
import { formatDate } from "../../util/dateFormatter";
import { getAuthenticatedUser } from "../../util/auth.utils";
import { deleteContactUsForm, getAllContactUsForms, getContactUs, upsertContactUs } from "../../services/group/contact.service";
import { createAuditLog } from "../../services/global/audit-log.service";

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

      // Create audit log entry
      await createAuditLog({
        user_id: auth.userId,
        action: isNew ? 'CONTACT_INFO_CREATED' : 'CONTACT_INFO_UPDATED',
        entity_type: 'ContactInfo',
        entity_id: contact.id,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        previous_state: existingContact ? {
          title: existingContact.title,
          description1: existingContact.description1,
          description2: existingContact.description2,
          location: existingContact.location,
          phone: existingContact.phone,
          email: existingContact.email,
          workingHour: existingContact.workingHour,
          googleMap: existingContact.googleMap,
          facebook: existingContact.facebook,
          instagram: existingContact.instagram,
          twitter: existingContact.twitter,
          linkedin: existingContact.linkedin
        } : undefined,
        new_state: {
          title: contact.title,
          description1: contact.description1,
          description2: contact.description2,
          location: contact.location,
          phone: contact.phone,
          email: contact.email,
          workingHour: contact.workingHour,
          googleMap: contact.googleMap,
          facebook: contact.facebook,
          instagram: contact.instagram,
          twitter: contact.twitter,
          linkedin: contact.linkedin
        }
      });

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
  
  // Get all contact form submissions (admin only)
  // getAllContactForms: async (req: Request, res: Response): Promise<void> => {
  //   try {
  //     // Check authentication
  //     const auth = getAuthenticatedUser(req, res);
  //     if (!auth) return;
      
  //     const forms = await getAllContactUsForms();
      
  //     res.status(200).json({
  //       success: true,
  //       message: "Contact form submissions fetched successfully",
  //       data: forms.map(form => ({
  //         ...form,
  //         createdAt: formatDate(form.createdAt)
  //       }))
  //     });
  //   } catch (error) {
  //     console.error("Error fetching contact form submissions:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: (error as Error).message || "Failed to fetch contact form submissions"
  //     });
  //   }
  // },
  

  getAllContactForms: async (req: Request, res: Response): Promise<void> => {
    try {
      // Check authentication
      const auth = getAuthenticatedUser(req, res);
      if (!auth) return;
      
      // Get pagination parameters from the request query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page and limit must be positive, and limit cannot exceed 100.'
        });
        return;
      }
      
      // Get paginated contact forms
      const { contactForms, pagination } = await getAllContactUsForms(page, limit);
      
      res.status(200).json({
        success: true,
        message: "Contact form submissions fetched successfully",
        pagination,
        data: contactForms.map(form => ({
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
  
      const deletedSubmission = await deleteContactUsForm(formId);
  
      if (!deletedSubmission) {
        res.status(404).json({
          success: false,
          message: `Contact form submission with ID ${formId} not found`,
        });
        return;
      }
  
      // Create audit log entry
      await createAuditLog({
        user_id: auth.userId,
        action: 'DELETED_CONTACT_FORM',
        entity_type: 'ContactForm',
        entity_id: formId,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
      });
  
      res.status(200).json({
        success: true,
        message: "Contact form submission deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting contact form submission:", error);
  
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to delete contact form submission",
        });
      }
    }
  }
  

};