import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateComplianceDetailInput, CreateComplianceInput, UpdateComplianceDetailInput, UpdateComplianceInput } from '../../../types/parasole/compliance.types';

// Create compliance
export const createCompliance = async (data: CreateComplianceInput) => {
  // Check if index is already in use
  const existingCompliance = await parasole.compliance.findFirst({
    where: { index: data.index },
  });
  
  if (existingCompliance) {
    throw new Error(`A compliance with index ${data.index} already exists. Please use a unique index.`);
  }
  
  // Generate slug from title
  const slug = generateSlug(data.title);
  
  // Check if slug already exists
  const existingComplianceWithSlug = await parasole.compliance.findUnique({
    where: { slug },
  });
  
  if (existingComplianceWithSlug) {
    throw new Error(`A compliance with slug "${slug}" already exists. Please use a unique title.`);
  }
  
  return await parasole.compliance.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      images: data.images || [], // Default to empty array if no images are provided
      index: data.index,
      createdBy: data.createdBy,
      updatedBy: "N/A",
    },
  });
};

// Get all compliances
export const getAllCompliances = async () => {
  return await parasole.compliance.findMany({
    orderBy: { index: 'asc' }
  });
};

// Get compliance by ID
export const getComplianceById = async (id: number) => {
  return await parasole.compliance.findUnique({
    where: { id }
  });
};

// Update compliance
export const updateCompliance = async (id: number, data: UpdateComplianceInput) => {
  // Check if index is already in use by another compliance
  if (data.index !== undefined) {
    const existingCompliance = await parasole.compliance.findFirst({
      where: {
        index: data.index,
        NOT: { id: id }
      }
    });
    
    if (existingCompliance) {
      throw new Error(`A compliance with index ${data.index} already exists. Please use a unique index.`);
    }
  }
  
  // Check if title is being updated and generate new slug if needed
  let slugUpdate = {};
  if (data.title !== undefined) {
    const slug = generateSlug(data.title);
    
    // Check if new slug would conflict with existing ones (except this record)
    const existingWithSlug = await parasole.compliance.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });
    
    if (existingWithSlug) {
      throw new Error(`A compliance with slug "${slug}" already exists. Please use a unique title.`);
    }
    
    slugUpdate = { slug };
  }
  
  return await parasole.compliance.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...slugUpdate,
      ...(data.description !== undefined && { description: data.description }),
      ...(data.images !== undefined && { images: data.images }),
      ...(data.index !== undefined && { index: data.index }),
      ...(data.status !== undefined && { status: data.status }),
      updatedBy: data.updatedBy,
      updatedAt: new Date()
    }
  });
};

// Delete compliance
export const deleteCompliance = async (id: number) => {
  return await parasole.compliance.delete({
    where: { id }
  });
};





// ===========================  For Compliance Detail Service Manage ===========================



// Create a new compliance detail
export const createComplianceDetail = async (data: CreateComplianceDetailInput) => {
    // First check if the compliance exists
    const complianceExists = await parasole.compliance.findUnique({
        where: { id: data.complianceId }
    });
    
    if (!complianceExists) {
        throw new Error(`Compliance with ID ${data.complianceId} does not exist.`);
    }
   
    // Generate slug from title
    const slug = generateSlug(data.title);
   
    // check if title already exists for this compliance
    const existingComplianceTitle = await parasole.complianceDetail.findFirst({
        where: {
            complianceId: data.complianceId,
            slug: slug
        }
    });
    
    if (existingComplianceTitle) {
        throw new Error(`A detail with this title already exists for this compliance. Please use a different title.`);
    }
    
    // Check if index is already used
    const existingDetail = await parasole.complianceDetail.findFirst({
        where: {
            index: data.index
        }
    });
   
    if (existingDetail) {
        throw new Error(`A compliance detail with index ${data.index} already exists. Please use a unique index.`);
    }
   
    // Create the compliance detail
    return await parasole.complianceDetail.create({
        data: {
            complianceId: data.complianceId,
            title: data.title,
            slug: slug,
            description: data.description,
            shortDescrip: data.shortDescrip,
            image: data.image || '',
            index: data.index,
            createdBy: data.createdBy,
            updatedBy: null
        },
    });
};

// Get all compliance details
export const getAllComplianceDetails = async () => {
    return await parasole.complianceDetail.findMany({
        orderBy: { index: 'asc' },
        include: {
            compliance: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Get compliance detail by ID
export const getComplianceDetailById = async (id: number) => {
    return await parasole.complianceDetail.findUnique({
        where: { id },
        include: {
            compliance: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Update compliance detail
export const updateComplianceDetail = async (id: number, data: UpdateComplianceDetailInput) => {
    // Get existing compliance detail to check current values
    const existingDetail = await parasole.complianceDetail.findUnique({
        where: { id }
    });

    if (!existingDetail) {
        throw new Error(`Compliance detail with ID ${id} not found`);
    }

    // If complianceId is changing, check if the new compliance exists
    if (data.complianceId !== undefined && data.complianceId !== existingDetail.complianceId) {
        const complianceExists = await parasole.compliance.findUnique({
            where: { id: data.complianceId }
        });
        
        if (!complianceExists) {
            throw new Error(`Compliance with ID ${data.complianceId} does not exist.`);
        }
    }

    // If index is changing, check if it's already in use
    if (data.index !== undefined && data.index !== existingDetail.index) {
        const existingWithIndex = await parasole.complianceDetail.findFirst({
            where: {
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingWithIndex) {
            throw new Error(`A compliance detail with index ${data.index} already exists. Please use a unique index.`);
        }
    }

    // If title is changing, update slug and check for duplicates
    let slug;
    if (data.title !== undefined && data.title !== existingDetail.title) {
        slug = generateSlug(data.title);
        
        // Check if slug is already in use
        const existingSlug = await parasole.complianceDetail.findFirst({
            where: {
                slug,
                NOT: { id: id }
            }
        });
        
        if (existingSlug) {
            throw new Error(`A compliance detail with slug "${slug}" already exists. Please use another title.`);
        }
    }
    
    // Update the compliance detail
    return await parasole.complianceDetail.update({
        where: { id },
        data: {
            ...(data.complianceId !== undefined && { complianceId: data.complianceId }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.title !== undefined && { slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.shortDescrip !== undefined && { shortDescrip: data.shortDescrip }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete compliance detail
export const deleteComplianceDetail = async (id: number) => {
    return await parasole.complianceDetail.delete({
        where: { id }
    });
};