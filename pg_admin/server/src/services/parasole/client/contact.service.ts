import { ContactFormInput } from '../../../types/parasole/contact.types';
import { parasole } from '../../../config/db.config';

// Get all Contact 
export const getContact = async () => {
    try {
        return await parasole.contact.findMany({
            where: {
                status: 'ACTIVE',
            },
            select: {
                id: true,
                index: true,
                title: true,
                description: true,
                image: true,
            },
            orderBy: {
              index: 'asc',
            },
        });
    } catch (error) {
        console.error('Error fetching Contact with details:', error);
        throw new Error('Failed to fetch Contact with details');
    }
  };

  // Get all Contact 
  export const getContactMedia = async () => {
    try {
        const media = await parasole.contactMedia.findFirst({
            orderBy: {
                id: 'asc', 
            },
            select: {
                id: true,
                title: true,
                description: true,
                facebook: true,
                instagram: true,
                twitter: true,
                linkedin: true,
                youtube: true,
                tiktok: true,
                telegram: true,
                email: true,
                phone: true,
                address: true,
                map: true
            }
        });
        
        if (!media) {
            throw new Error('No contact media information found');
        }
        
        return media;
    } catch (error) {
        console.error('Error fetching Contact Media:', error);
        throw new Error('Failed to fetch Contact Media');
    }
};

// Create a new contact form submission
export const createContactUsForm = async (data: ContactFormInput) => {
  try {
      return await parasole.contactForm.create({
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
      console.error('Error creating contact form submission:', error);
      throw error;
  }
};