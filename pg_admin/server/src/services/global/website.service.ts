
import { global } from '../../config/db.config';

type WebsiteData = {
        name: string;
        domain: string;
        description: string;
      };


const generateSlug = (domain: string): string => {
  return domain
    .toLowerCase() 
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const createWebsite = async (data: WebsiteData) => {
  
    // Generate the slug from the domain
  const slug = generateSlug(data.name);

  // Check if the slug already exists
  const existingWebsite = await global.website.findUnique({ where: { domain: slug } });
  if (existingWebsite) {
    throw new Error('A website with this name already exists');
  }

  return await global.website.create({
    data: {
      name: data.name,
      domain: slug,
      description: data.description,
      status: 'ACTIVE',
    },
  });
};

// Get all websites
export const getAllWebsites = async () => {
    return await global.website.findMany();
};

// Get a website by ID
export const getWebsiteById = async (id: number) => {
  const website = await global.website.findUnique({ where: { id } });
  if (!website) {
    throw new Error('Website not found');
  }
  return website;
};

// Update a website
export const updateWebsite = async (id: number, data: { name?: string; domain?: string; description?: string; status?: string }) => {
    
    // Check if the website exists
    const existingWebsite = await global.website.findUnique({ where: { id } });
    if (!existingWebsite) {
      throw new Error('Website not found');
    }
  
    // // If updating the domain, ensure it's unique
    // if (data.domain) {
    //   const duplicateWebsite = await global.website.findUnique({ where: { domain: data.domain } });
    //   if (duplicateWebsite && duplicateWebsite.id !== id) {
    //     throw new Error('A website with this domain already exists');
    //   }
    // }

    let slug = null;
    if (data.domain) {
      slug = generateSlug(data.domain);

      const duplicateWebsite = await global.website.findUnique({ where: { domain: slug } });
      if (duplicateWebsite && duplicateWebsite.id !== id) {
        throw new Error('A website with this name already exists');
      }
    }
  
    return await global.website.update({
      where: { id },
      data: {
        name: data.name,
        domain: slug || undefined,
        description: data.description,
        status: data.status as any, // Cast to avoid TypeScript errors
      },
    });
};
