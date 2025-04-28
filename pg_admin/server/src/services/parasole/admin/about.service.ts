import { generateSlug } from '../../../util/slugGenerator';
import { parasole } from '../../../config/db.config';
import { CreateAboutDetailInput, CreateAboutInput, UpdateAboutDetailInput, UpdateAboutInput } from '../../../types/parasole/about.types';

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




// ===========================  For About Detail Service Manage ===========================


// Create a new about detail
export const createAboutDetail = async (data: CreateAboutDetailInput) => {
    // First check if the about exists
    const aboutExists = await parasole.about.findUnique({
        where: { id: data.aboutId }
    });
    
    if (!aboutExists) {
        throw new Error(`About with ID ${data.aboutId} does not exist.`);
    }
   
    // Generate slug from title
    const slug = generateSlug(data.title);
   
    // check if title already exists for this about
    const existingAboutTitle = await parasole.aboutDetail.findFirst({
        where: {
            aboutId: data.aboutId,
            slug: slug
        }
    });
    
    if (existingAboutTitle) {
        throw new Error(`A detail with this title already exists for this about. Please use a different title.`);
    }
    
    // Check if index is provided and is already used for this about
    if (data.index !== undefined) {
        const existingDetail = await parasole.aboutDetail.findFirst({
            where: {
                aboutId: data.aboutId,
                index: data.index
            }
        });
       
        if (existingDetail) {
            throw new Error(`A detail with index ${data.index} already exists for this about. Please use a unique index.`);
        }
    }
   
    return await parasole.aboutDetail.create({
        data: {
            aboutId: data.aboutId,
            title: data.title,
            slug: slug,
            description: data.description,
            image: data.image || '',
            link: data.link || '', 
            ...(data.index !== undefined && { index: data.index }),
            createdBy: data.createdBy,
            updatedBy: null
        },
    });
};

// Get all about details
export const getAllAboutDetails = async () => {
    return await parasole.aboutDetail.findMany({
        orderBy: [
            { aboutId: 'desc' },  
            { createdAt: 'asc' }
        ],
        include: {
            about: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Get about detail by ID
export const getAboutDetailById = async (id: number) => {
    return await parasole.aboutDetail.findUnique({
        where: { id },
        include: {
            about: {
                select: {
                    title: true
                }
            }
        }
    });
};

// Update about detail
export const updateAboutDetail = async (id: number, data: UpdateAboutDetailInput) => {
    // Get existing about detail to check current values
    const existingDetail = await parasole.aboutDetail.findUnique({
        where: { id }
    });

    if (!existingDetail) {
        throw new Error(`About detail with ID ${id} not found`);
    }

    // If aboutId is changing, check if the new about exists
    if (data.aboutId !== undefined && data.aboutId !== existingDetail.aboutId) {
        const aboutExists = await parasole.about.findUnique({
            where: { id: data.aboutId }
        });
        
        if (!aboutExists) {
            throw new Error(`About with ID ${data.aboutId} does not exist.`);
        }
    }

    // If index is provided and changing, check if it's already in use for this about
    if (data.index !== undefined && data.index !== null) {
        const aboutId = data.aboutId !== undefined ? data.aboutId : existingDetail.aboutId;
        
        const existingWithIndex = await parasole.aboutDetail.findFirst({
            where: {
                aboutId: aboutId,
                index: data.index,
                NOT: { id: id }
            }
        });
        
        if (existingWithIndex) {
            throw new Error(`A detail with index ${data.index} already exists for this about. Please use a unique index.`);
        }
    }

    // If title is changing, update slug and check for duplicates
    let slug;
    if (data.title !== undefined && data.title !== existingDetail.title) {
        slug = generateSlug(data.title);
        
        // Check if slug is already in use
        const existingSlug = await parasole.aboutDetail.findFirst({
            where: {
                slug,
                NOT: { id: id }
            }
        });
        
        if (existingSlug) {
            throw new Error(`An about detail with slug "${slug}" already exists. Please use another title.`);
        }
    }
    
    // Update the about detail
    return await parasole.aboutDetail.update({
        where: { id },
        data: {
            ...(data.aboutId !== undefined && { aboutId: data.aboutId }),
            ...(data.title !== undefined && { title: data.title }),
            ...(data.title !== undefined && { slug }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.link !== undefined && { link: data.link }),
            ...(data.index !== undefined && { index: data.index }),
            ...(data.status !== undefined && { status: data.status }),
            updatedBy: data.updatedBy,
            updatedAt: new Date()
        }
    });
};

// Delete about detail
export const deleteAboutDetail = async (id: number) => {
    return await parasole.aboutDetail.delete({
        where: { id }
    });
};