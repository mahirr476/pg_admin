import { Request, Response } from "express";
import {
    upsertContactMedia, getContactMedia
} from "../../../services/parasole/admin/contactMedia.service";
import { formatDate } from "../../../util/dateFormatter";
import { getAuthenticatedUser } from "../../../util/auth.utils";
import {
    UpsertContactMediaInput
} from "../../../types/parasole/contactMedia.types";

export const ContactMediaController = {
    // Upsert (create or update) contact media
    upsert: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const { 
                title, 
                description, 
                facebook,
                instagram,
                twitter,
                linkedin,
                youtube,
                tiktok,
                telegram,
                email,
                phone,
                address,
                map
            } = req.body;

            // Validate required fields (add any fields that must be required)
            if (!title) {
                throw new Error("Title is required.");
            }

            // Create/Update the ContactMedia
            const contactMediaData: UpsertContactMediaInput = {
                title,
                description,
                facebook,
                instagram,
                twitter,
                linkedin,
                youtube,
                tiktok,
                telegram,
                email,
                phone,
                address,
                map,
                userName: auth.userName,
            };

            const contactMedia = await upsertContactMedia(contactMediaData);

            res.status(200).json({
                success: true,
                message: "Contact media saved successfully",
                data: {
                    ...contactMedia,
                    createdAt: formatDate(contactMedia.createdAt),
                    updatedAt: contactMedia.updatedAt ? formatDate(contactMedia.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to save contact media",
            });
        }
    },

    // Get contact media
    getContactMedia: async (req: Request, res: Response): Promise<void> => {
        try {
            // Check authentication
            const auth = getAuthenticatedUser(req, res);
            if (!auth) return;

            const contactMedia = await getContactMedia();

            // If no contact media found, return empty object instead of null
            if (!contactMedia) {
                res.status(200).json({
                    success: true,
                    message: "No contact media found",
                    data: {},
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Contact media retrieved successfully",
                data: {
                    ...contactMedia,
                    createdAt: formatDate(contactMedia.createdAt),
                    updatedAt: contactMedia.updatedAt ? formatDate(contactMedia.updatedAt) : null,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to retrieve contact media",
            });
        }
    },


};