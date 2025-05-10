import { parasole } from '../../../config/db.config';
import { UpsertContactMediaInput } from '../../../types/parasole/contactMedia.types';

// Upsert (create or update) contact media
export const upsertContactMedia = async (data: UpsertContactMediaInput) => {
    // Check if any contact media record exists
    const existingContactMedia = await parasole.contactMedia.findFirst();

    if (existingContactMedia) {
        // Update existing record
        return await parasole.contactMedia.update({
            where: { id: existingContactMedia.id },
            data: {
                title: data.title,
                description: data.description,
                facebook: data.facebook,
                instagram: data.instagram,
                twitter: data.twitter,
                linkedin: data.linkedin,
                youtube: data.youtube,
                tiktok: data.tiktok,
                telegram: data.telegram,
                email: data.email,
                phone: data.phone,
                address: data.address,
                map: data.map,
                updatedBy: data.userName,
                updatedAt: new Date(),
            },
        });
    } else {
        // Create new record
        return await parasole.contactMedia.create({
            data: {
                title: data.title,
                description: data.description,
                facebook: data.facebook,
                instagram: data.instagram,
                twitter: data.twitter,
                linkedin: data.linkedin,
                youtube: data.youtube,
                tiktok: data.tiktok,
                telegram: data.telegram,
                email: data.email,
                phone: data.phone,
                address: data.address,
                map: data.map,
                createdBy: data.userName,
                updatedBy: "N/A",
            },
        });
    }
};

// Get contact media
export const getContactMedia = async () => {
    return await parasole.contactMedia.findFirst();
};

