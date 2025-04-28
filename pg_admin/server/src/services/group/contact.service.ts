import { ContactUsData, ContactUsFormInput } from '../../types/contact.types';
import { group } from '../../config/db.config';


// Get the contact information
export const getContactUs = async () => {
    try {
      return await group.contactUs.findFirst();
    } catch (error) {
      console.error('Error fetching contact information:', error);
      throw error;
    }
};
  
// Create or update contact information
export const upsertContactUs = async (data: ContactUsData, userName: string) => {
try {
    // Check if contact information already exists
    const existingContact = await getContactUs();
    
    if (!existingContact) {
    // Create new contact information
    return await group.contactUs.create({
        data: {
        title: data.title,
        description1: data.description1,
        description2: data.description2,
        location: data.location,
        phone: data.phone,
        email: data.email,
        workingHour: data.workingHour,
        googleMap: data.googleMap,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        linkedin: data.linkedin,
        createdBy: userName
        }
    });
    } else {
    // Update existing contact information
    return await group.contactUs.update({
        where: { id: existingContact.id },
        data: {
        title: data.title,
        description1: data.description1,
        description2: data.description2,
        location: data.location,
        phone: data.phone,
        email: data.email,
        workingHour: data.workingHour,
        googleMap: data.googleMap,
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
        linkedin: data.linkedin,
        updatedBy: userName,
        updatedAt: new Date()
        }
    });
    }
} catch (error) {
    console.error('Error updating contact information:', error);
    throw error;
}
};

// Get all contact form submissions
export const getAllContactUsForms = async () => {
try {
    return await group.contactUsForm.findMany({
    orderBy: {
        createdAt: 'desc'
    }
    });
} catch (error) {
    console.error('Error fetching contact form submissions:', error);
    throw new Error('Failed to fetch contact form submissions');
}
};

  // Delete a contact form submission
export const deleteContactUsForm = async (id: number) => {
    try {
      // Check if contact form submission exists
      const submission = await group.contactUsForm.findUnique({
        where: { id }
      });
      
      if (!submission) {
        throw new Error(`Contact form submission with ID ${id} not found`);
      }
      
      // Delete the contact form submission
      await group.contactUsForm.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting contact form submission:', error);
      throw error;
    }
};