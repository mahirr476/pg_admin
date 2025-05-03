import { Request, Response } from "express";
import { createContactUsForm } from "../../../services/parasole/client/contact.service";
import { createAuditLog } from "../../../services/global/audit-log.service";
import { 
  containsMaliciousContent, 
  isRateLimited, 
  isValidEmail, 
  isValidPhone 
} from "../../../util/validation.utils";

export const ContactController = {
    // getContactInfo: async (req: Request, res: Response): Promise<void> => {
    //     try {
    //         const contact = await getContactUS();
            
    //         res.status(200).json({
    //             success: true,
    //             message: "Contact US data fetched successfully.",
    //             data: {
    //                 contactUs: contact
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error fetching Contact US data:", error);
    //         res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : 'Failed to fetch Contact US data'
    //         });
    //     }
    // },

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
            const { name, organization, email, phone, message, type } = req.body;
        
            if (!name || !organization || !email || !phone || !message || !type) {
                res.status(400).json({
                    success: false,
                    message: 'All fields are required: name, organization, email, phone, type and message.'
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
                type,
                message
            });
        
            // Create audit log entry
            await createAuditLog({
                action: 'PARASOLE_CONTACT_FORM_SUBMITTED',
                entity_type: 'ContactForm',
                entity_id: contact.id,
                ip_address: clientIp,
                user_agent: req.get('User-Agent'),
                new_state: {
                    name,
                    organization,
                    email,
                    phone,
                    type,
                    message
                }
            });
        
            res.status(201).json({
                success: true,
                message: "Thank you for your message. We will contact you soon."
            });
        } catch (error) {
            console.error("Error submitting contact form:", error);
            res.status(500).json({
                success: false,
                message: "Failed to submit your message. Please try again later."
            });
        }
    }
};


// import { createAuditLog } from "../../../services/global/audit-log.service";
// import { containsMaliciousContent, isRateLimited, isValidEmail, isValidPhone } from "../../..//util/validation.utils";
// import { createContactUsForm, getContactUS } from "../../../services/group/client/contact.service";
// import { Request, Response } from "express";

// export const ContactController = {

//     getContactInfo: async (req: Request, res: Response): Promise<void> => {
//         try {
//             const contact = await getContactUS();
            
//             res.status(200).json({
//                 success: true,
//                 message: "Contact US data fetched successfully.",
//                 data: {
//                     contactUs: contact,
//                 }
//             });
//         } catch (error) {
//             console.error("Error fetching Contact US data:", error);
//             res.status(500).json({
//                 success: false,
//                 message: (error as Error).message || 'Failed to fetch Contact US data'
//             });
//         }
//     },

//     submitContactForm: async (req: Request, res: Response): Promise<void> => {
//         try {
//           // Get client IP for rate limiting
//           const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
      
//           // Check rate limiting
//           if (isRateLimited(clientIp)) {
//             res.status(429).json({
//               success: false,
//               message: 'Too many requests. Please try again later.'
//             });
//             return;
//           }
      
//           // Validate required fields
//           const { name, organization, email, phone, message } = req.body;
      
//           if (!name || !organization || !email || !phone || !message) {
//             res.status(400).json({
//               success: false,
//               message: 'All fields are required: name, organization, email, phone, and message.'
//             });
//             return;
//           }
      
//           // Validate email format
//           if (!isValidEmail(email)) {
//             res.status(400).json({
//               success: false,
//               message: 'Please provide a valid email address.'
//             });
//             return;
//           }
      
//           // Validate phone format
//           if (!isValidPhone(phone)) {
//             res.status(400).json({
//               success: false,
//               message: 'Please provide a valid phone number.'
//             });
//             return;
//           }
      
//           // Check for malicious content
//           if (
//             containsMaliciousContent(name) ||
//             containsMaliciousContent(organization) ||
//             containsMaliciousContent(email) ||
//             containsMaliciousContent(message)
//           ) {
//             res.status(400).json({
//               success: false,
//               message: 'Your submission contains invalid content.'
//             });
//             return;
//           }
      
//           // Validate message length
//           if (message.length < 10) {
//             res.status(400).json({
//               success: false,
//               message: 'Message is too short. Please provide more details.'
//             });
//             return;
//           }
      
//           if (message.length > 5000) {
//             res.status(400).json({
//               success: false,
//               message: 'Message is too long. Please limit to 5000 characters.'
//             });
//             return;
//           }
      
//           // Create contact form submission
//           const contact = await createContactUsForm({
//             name,
//             organization,
//             email,
//             phone,
//             message
//           });
      
//           // Create audit log entry
//           await createAuditLog({
//             action: 'CONTACT_FORM_SUBMITTED',
//             entity_type: 'ContactForm',
//             entity_id: contact.id,
//             ip_address: clientIp,
//             user_agent: req.get('User-Agent'),
//             new_state: {
//               name,
//               organization,
//               email,
//               phone,
//               message
//             }
//           });
      
//           res.status(201).json({
//             success: true,
//             message: "Thank you for your message. We will contact you soon.",
//             // data: {
//             //   id: contact.id
//             // }
//           });
//         } catch (error) {
//           console.error("Error submitting contact form:", error);
//           res.status(500).json({
//             success: false,
//             message: "Failed to submit your message. Please try again later."
//           });
//         }
//     },

// };