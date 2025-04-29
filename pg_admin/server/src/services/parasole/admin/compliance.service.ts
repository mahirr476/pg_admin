import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateComplianceInput, UpdateComplianceInput } from '../../../types/parasole/compliance.types';

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