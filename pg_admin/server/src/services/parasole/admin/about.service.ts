import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateAboutInput, UpdateAboutInput } from '../../../types/parasole/about.types';

// Create about
export const createAbout = async (data: CreateAboutInput) => {
  // Check if index is already in use
  const existingAbout = await parasole.about.findFirst({
    where: { index: data.index },
  });

  if (existingAbout) {
    throw new Error(`An about with index ${data.index} already exists. Please use a unique index.`);
  }

  // Generate slug from title
  const slug = generateSlug(data.title);

  // Check if slug already exists
  const existingAboutWithSlug = await parasole.about.findUnique({
    where: { slug },
  });

  if (existingAboutWithSlug) {
    throw new Error(`An about with slug "${slug}" already exists. Please use a unique title.`);
  }

  return await parasole.about.create({
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

// Get all abouts
export const getAllAbouts = async () => {
  return await parasole.about.findMany({
    orderBy: { index: 'asc' }
  });
};

// Get about by ID
export const getAboutById = async (id: number) => {
  return await parasole.about.findUnique({
    where: { id }
  });
};

// Update about
export const updateAbout = async (id: number, data: UpdateAboutInput) => {
  // Check if index is already in use by another about
  if (data.index !== undefined) {
    const existingAbout = await parasole.about.findFirst({
      where: {
        index: data.index,
        NOT: { id: id }
      }
    });
    
    if (existingAbout) {
      throw new Error(`An about with index ${data.index} already exists. Please use a unique index.`);
    }
  }

  // Check if title is being updated and generate new slug if needed
  let slugUpdate = {};
  if (data.title !== undefined) {
    const slug = generateSlug(data.title);
    
    // Check if new slug would conflict with existing ones (except this record)
    const existingWithSlug = await parasole.about.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });
    
    if (existingWithSlug) {
      throw new Error(`An about with slug "${slug}" already exists. Please use a unique title.`);
    }
    
    slugUpdate = { slug };
  }
  
  return await parasole.about.update({
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

// Delete about
export const deleteAbout = async (id: number) => {
  return await parasole.about.delete({
    where: { id }
  });
};