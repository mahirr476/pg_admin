import { MediaContactInput } from '../../../types/media.types';
import { group } from '../../../config/db.config';

export const getMediaContent = async () => {
    try {
        return await group.media.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                orderIndex: true,
                title: true,
                description: true
            },
            orderBy: {
                orderIndex: 'asc'
            }
        });
    } catch (error) {
        console.error("Error fetching Media Content:", error);
        throw new Error("Failed to fetch Media Content.");
    }
};

export const getVideoGallery = async () => {
    try {
        return await group.mediaGallery.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                link: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    } catch (error) {
        console.error("Error fetching Media Video Gallery:", error);
        throw new Error("Failed to fetch Media Video Gallery.");
    }
};

export const getMediaNews = async () => {
    try {
        return await group.mediaNews.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                link: true,
                tag: true,
                date: true
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching Media News:", error);
        throw new Error("Failed to fetch Media News.");
    }
};

export const getMediaInquiries = async () => {
    try {
        return await group.mediaInquery.findFirst({
            select: {
                id: true,
                title: true,
                description: true,
                email: true,
                contactNo: true,
                website: true
            }
        });
    } catch (error) {
        // console.error("Error fetching boards:", error);
        throw new Error("Failed to fetch Media Inquiries.");
    }
};

// Create a new media contact
export const createMediaContact = async (data: MediaContactInput) => {
    try {
      // Create the media contact
      return await group.mediaContact.create({
        data: {
          name: data.name,
          organization: data.organization,
          email: data.email,
          phone: data.phone,
          type: data.type,
          message: data.message
        }
      });
    } catch (error) {
      console.error('Error creating media contact:', error);
      throw error;
    }
};