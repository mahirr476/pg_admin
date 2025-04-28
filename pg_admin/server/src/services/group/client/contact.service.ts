import { ContactUsFormInput } from '../../../types/contact.types';
import { group } from '../../../config/db.config';

export const getContactUS = async () => {
  try {
      return await group.contactUs.findFirst({
          select: {
              id: true,
              title: true,
              description1: true,
              description2: true,
              location: true,
              phone: true,
              email: true,
              workingHour: true,
              googleMap: true,
              facebook: true,
              instagram: true,
              twitter: true,
              linkedin: true,
          }
      });
  } catch (error) {
      console.error("Error fetching Contact US:", error);
      throw new Error("Failed to fetch Contact US information.");
  }
};

// Create a new contact form submission
export const createContactUsForm = async (data: ContactUsFormInput) => {
  try {
      return await group.contactUsForm.create({
          data: {
              name: data.name,
              organization: data.organization,
              email: data.email,
              phone: data.phone,
              message: data.message
          }
      });
  } catch (error) {
      console.error('Error creating contact form submission:', error);
      throw error;
  }
};