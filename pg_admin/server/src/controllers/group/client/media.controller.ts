import { containsMaliciousContent, isRateLimited, isValidEmail, isValidPhone } from "../../../util/validation.utils";
import { createMediaContact, getMediaContent, getMediaInquiries, getMediaNews, getVideoGallery } from "../../../services/group/client/media.service";
import { Request, Response } from "express";

export const MediaController = {
    getMedia: async (req: Request, res: Response): Promise<void> => {
        try {
            const mediaContent = await getMediaContent();
            const videoGallery = await getVideoGallery();
            const mediaNews = await getMediaNews();
            const mediaInquiries = await getMediaInquiries();
            
            res.status(200).json({
                success: true,
                message: "Media data fetched successfully.",
                data: {
                    content: mediaContent,
                    videoGallery: videoGallery,
                    mediaNews: mediaNews,
                    inquiries: mediaInquiries,
                }
            });
        } catch (error) {
            console.error("Error fetching Media data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Media data'
            });
        }
    },

    // Submit a new media contact (public endpoint)
    submitContact: async (req: Request, res: Response): Promise<void> => {
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
        const { name, organization, email, phone, type, message } = req.body;
        
        if (!name || !organization || !email || !phone || !type || !message) {
            res.status(400).json({
            success: false,
            message: 'All fields are required: name, organization, email, phone, type, and message.'
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
        
        // Create contact request
        const contact = await createMediaContact({
            name,
            organization,
            email,
            phone,
            type,
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
};