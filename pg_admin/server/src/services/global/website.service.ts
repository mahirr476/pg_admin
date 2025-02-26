// import { WebsiteModel } from "../../model/global/website.model";

// type WebsiteData = {
//     name: string;
//     domain: string;
//     status?: 'ACTIVE' | 'INACTIVE';
//     description?: string;
//   };

// export const createWebsite  = async (data: WebsiteData) => {
    
//     const website = await WebsiteModel.create({
//         data: {
//             ...data,
//             status: data.status || 'ACTIVE'
//         },
//     });
    
//     return website;
// };

// export const getAllWebsites = async () => {
//     const websites = await WebsiteModel.findMany();
//     return websites;
// };

// import prisma from "../../config/db.config";
// import { WebsiteStatus } from "@prisma/client";

import { global } from '../../config/db.config';


type WebsiteData = {
  name: string;
  domain: string;
  description: string;
};


export const createWebsite = async (data: WebsiteData) => {
  return await global.website.create({
    data: {
      name: data.name,
      domain: data.domain,
      description: data.description,
      status: 'ACTIVE',
    }
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
export const updateWebsite = async (id: number, data: { name?: string; domain?: string; description?: string; status?: any }) => {
  // Check if the website exists
  const existingWebsite = await global.website.findUnique({ where: { id } });
  if (!existingWebsite) {
    throw new Error('Website not found');
  }

  // If updating the domain, ensure it's unique
  if (data.domain) {
    const duplicateWebsite = await global.website.findUnique({ where: { domain: data.domain.toLowerCase() } });
    if (duplicateWebsite && duplicateWebsite.id !== id) {
      throw new Error('A website with this domain already exists');
    }
  }

  return await global.website.update({
    where: { id },
    data: {
      name: data.name,
      domain: data.domain?.toLowerCase(),
      description: data.description,
      status: data.status,
    },
  });
};