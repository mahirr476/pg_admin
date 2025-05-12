import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateContactInput, UpdateContactInput } from '../../../types/parasole/contact.types';

// Create contact
export const createContact = async (data: CreateContactInput) => {
    // Check if index is already in use
    const existingContact = await parasole.contact.findFirst({
        where: { index: data.index },
    });
    if (existingContact) {
        throw new Error(`A contact with index ${data.index} already exists. Please use a unique index.`);
    }

    // Generate slug from title
    const slug = generateSlug(data.title);

    // Check if slug already exists
    const existingContactWithSlug = await parasole.contact.findUnique({
        where: { slug },
    });
    if (existingContactWithSlug) {
        throw new Error(`A contact with slug "${slug}" already exists. Please use a unique title.`);
    }

    return await parasole.contact.create({
        data: {
            title: data.title,
            slug,
            description: data.description,
            image: data.image, // Single image string or null
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: "N/A",
        },
    });
};

// Get all contacts
export const getAllContacts = async () => {
    return await parasole.contact.findMany({
        orderBy: { index: 'asc' }
    });
};

// Get contact by ID
export const getContactById = async (id: number) => {
    return await parasole.contact.findUnique({
        where: { id }
    });
};

// Update contact
export const updateContact = async (id: number, data: UpdateContactInput) => {
    // Check if index is already in use by another contact
    if (data.index !== undefined) {
        const existingContact = await parasole.contact.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });
        if (existingContact) {
            throw new Error(`A contact with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // Check if title is being updated and generate new slug if needed
    let slugUpdate = {};
    if (data.title !== undefined) {
        const slug = generateSlug(data.title);
       
        // Check if new slug would conflict with existing ones (except this record)
        const existingWithSlug = await parasole.contact.findFirst({
            where: {
                slug,
                NOT: { id }
            }
        });
        if (existingWithSlug) {
            throw new Error(`A contact with slug "${slug}" already exists. Please use a unique title.`);
        }
        slugUpdate = { slug };
    }

    return await parasole.contact.update({
        where: { id },
        data: {
            ...(data.title !== undefined && { title: data.title }),
            ...slugUpdate,
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }), // Now field names match in both schema and input
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete contact
export const deleteContact = async (id: number) => {
    return await parasole.contact.delete({
        where: { id }
    });
};




// Get all contact form submissions
export const getAllContactUsForms = async (page = 1, limit = 10) => {
    try {
        // Calculate the number of records to skip
        const skip = (page - 1) * limit;
        
        // Get the total count of contact forms for pagination metadata
        const totalCount = await parasole.contactForm.count();
        
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);
        
        // Get paginated contact forms
        const contactForms = await parasole.contactForm.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limit
        });
        
        // Return both the forms and pagination metadata
        return {
            contactForms,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
                firstPage: 1,
                lastPage: totalPages > 0 ? totalPages : 1
            }
        };
    } catch (error) {
        console.error('Error fetching contact form submissions:', error);
        throw new Error('Failed to fetch contact form submissions');
    }
};
// export const getAllContactUsForms = async () => {
//     try {
//         return await parasole.contactForm.findMany({
//         orderBy: {
//             createdAt: 'desc'
//         }
//         });
//     } catch (error) {
//         console.error('Error fetching contact form submissions:', error);
//         throw new Error('Failed to fetch contact form submissions');
//     }
// };

  // Delete a contact form submission
export const deleteContactUsForm = async (id: number) => {
    try {
      // Check if contact form submission exists
      const submission = await parasole.contactForm.findUnique({
        where: { id }
      });
      
      if (!submission) {
        throw new Error(`Contact form submission with ID ${id} not found`);
      }
      
      // Delete the contact form submission
      await parasole.contactForm.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting contact form submission:', error);
      throw error;
    }
};