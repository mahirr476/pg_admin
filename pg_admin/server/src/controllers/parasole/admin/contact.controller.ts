import fs from 'fs';
import path from 'path';
import { Request, Response } from "express";
import {
    createContact, deleteContact, getAllContacts, 
    getContactById, updateContact
} from "../../../services/parasole/admin/contact.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import { 
    CreateContactInput, UpdateContactInput 
} from "../../../types/parasole/contact.types";
import { UPLOAD_PATHS, uploadContactImage } from "../../../middleware/upload.middleware";

export const ContactController = {
    // Create a new contact
    create: async (req: Request, res: Response): Promise<void> => {
        uploadContactImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePath: string | null = null;

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                // Get uploaded file
                const file = req.file; // Single file upload
                imagePath = file 
                    ? `${UPLOAD_PATHS.CONTACT_IMAGES}/${file.filename}`
                    : null; // Default to null if no file is uploaded

                const { title, description, index } = req.body;

                // Validate required fields
                if (!title || !description || index === undefined) {
                    throw new Error("Title, description, and index are required fields.");
                }

                // Convert index to a number
                const indexNum = parseInt(index);
                if (isNaN(indexNum)) {
                    throw new Error('Index must be a valid number');
                }

                // Create the new Contact
                const contactData: CreateContactInput = {
                    title,
                    description,
                    index: indexNum,
                    image: imagePath, // Pass single image path (or null)
                    createdBy: auth.userName,
                };

                const contact = await createContact(contactData);

                res.status(201).json({
                    success: true,
                    message: "Contact created successfully",
                    data: {
                        ...contact,
                        createdAt: formatDate(contact.createdAt),
                        updatedAt: contact.updatedAt ? formatDate(contact.updatedAt) : null,
                    },
                });

                // Clear image path after successful creation
                imagePath = null;
            } catch (error) {
                // Delete uploaded image if an error occurs
                if (imagePath) {
                    deleteUploadedFile(imagePath);
                }

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('slug')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message,
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to create contact",
                });
            }
        });
    },

    // Get all contacts
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const contacts = await getAllContacts();

            res.status(200).json({
                success: true,
                message: "Contacts retrieved successfully",
                data: contacts.map(contact => ({
                    ...contact,
                    createdAt: formatDate(contact.createdAt),
                    updatedAt: contact.updatedAt ? formatDate(contact.updatedAt) : null,
                })),
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve contacts",
            });
        }
    },

    // Get contact by ID
    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
                return;
            }

            const contact = await getContactById(id);

            if (!contact) {
                res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Contact retrieved successfully",
                data: {
                    ...contact,
                    createdAt: formatDate(contact.createdAt),
                    updatedAt: contact.updatedAt ? formatDate(contact.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve contact",
            });
        }
    },

    // Update contact
    update: async (req: Request, res: Response): Promise<void> => {
        uploadContactImage(req, res, async (err: any) => {
            if (err) {
                console.error('Error uploading image:', err);
                res.status(400).json({
                    success: false,
                    message: 'Image upload failed: ' + err.message,
                });
                return;
            }

            let imagePath: string | null = null;

            try {
                // Check authentication
                const auth = getAuthenticatedUser(req, res);
                if (!auth) return;

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid ID format",
                    });
                    return;
                }

                // Get existing contact to check if it exists
                const existingContact = await getContactById(id);
                if (!existingContact) {
                    res.status(404).json({
                        success: false,
                        message: "Contact not found",
                    });
                    return;
                }

                const { title, description, index, status } = req.body;

                // Get uploaded file
                const file = req.file; // Single file upload
                imagePath = file
                    ? `${UPLOAD_PATHS.CONTACT_IMAGES}/${file.filename}`
                    : null; // Default to null if no file is uploaded

                // Prepare update data
                const updateData: UpdateContactInput = {
                    updatedBy: auth.userName
                };

                // Only include fields that are provided in the request
                if (title !== undefined) updateData.title = title;
                if (description !== undefined) updateData.description = description;
                if (index !== undefined) {
                    const indexNum = parseInt(index);
                    if (isNaN(indexNum)) {
                        throw new Error('Index must be a valid number');
                    }
                    updateData.index = indexNum;
                }
                if (status !== undefined) updateData.status = status;
                
                // Handle image update if provided
                let oldImagePath: string | null = null;
                if (file) {
                    // Store old image path for deletion later
                    oldImagePath = existingContact.image || null;
                    updateData.image = imagePath;
                }

                // Update the contact
                const updatedContact = await updateContact(id, updateData);

                // If update successful and we have a new image, delete the old one
                if (oldImagePath) {
                    try {
                        fs.unlinkSync(path.resolve(oldImagePath));
                    } catch (e) {
                        console.error("Failed to delete old image file:", e);
                    }
                }

                res.status(200).json({
                    success: true,
                    message: "Contact updated successfully",
                    data: {
                        ...updatedContact,
                        createdAt: formatDate(updatedContact.createdAt),
                        updatedAt: updatedContact.updatedAt ? formatDate(updatedContact.updatedAt) : null,
                    },
                });
            } catch (error) {
                // Delete uploaded image if an error occurs
                if (imagePath) {
                    deleteUploadedFile(imagePath);
                }

                if ((error as Error).message.includes('already exists') ||
                    (error as Error).message.includes('slug')) {
                    res.status(400).json({
                        success: false,
                        message: (error as Error).message,
                    });
                    return;
                }

                res.status(500).json({
                    success: false,
                    message: (error as Error).message || "Failed to update contact",
                });
            }
        });
    },

    // Delete contact
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid ID format",
                });
                return;
            }

            // Get existing contact to check if it exists and to get image path
            const existingContact = await getContactById(id);
            if (!existingContact) {
                res.status(404).json({
                    success: false,
                    message: "Contact not found",
                });
                return;
            }

            // Delete the contact
            await deleteContact(id);

            // Delete associated image if exists
            if (existingContact.image) {
                deleteUploadedFile(existingContact.image);
            }

            res.status(200).json({
                success: true,
                message: "Contact deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to delete contact",
            });
        }
    },
};

// Helper function to delete uploaded file
const deleteUploadedFile = (filePath: string): void => {
    try {
        fs.unlinkSync(path.resolve(filePath));
    } catch (e) {
        console.error("Failed to delete image file:", e);
    }
};