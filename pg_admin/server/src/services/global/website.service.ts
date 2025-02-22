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


import { WebsiteStatus } from '../../../generated/global';
import prisma from '../../config/db.config';

type WebsiteData = {
  name: string;
  domain: string;
  description: string;
};

export const createWebsite = async (data: WebsiteData) => {
  // Normalize the domain to lowercase
  const normalizedDomain = data.domain.toLowerCase();

  // Check if the domain already exists
  const existingWebsite = await prisma.website.findUnique({ where: { domain: normalizedDomain } });
  if (existingWebsite) {
    throw new Error('A website with this domain already exists');
  }

  return await prisma.website.create({
    data: {
      name: data.name,
      domain: normalizedDomain,
      description: data.description,
      status: 'ACTIVE',
    },
  });
};

// Get all websites
export const getAllWebsites = async () => {
  return await prisma.website.findMany();
};

// Update a website
export const updateWebsite = async (id: number, data: { name?: string; domain?: string; description?: string; status?: WebsiteStatus }) => {
  // Check if the website exists
  const existingWebsite = await prisma.website.findUnique({ where: { id } });
  if (!existingWebsite) {
    throw new Error('Website not found');
  }

  // If updating the domain, ensure it's unique
  if (data.domain) {
    const duplicateWebsite = await prisma.website.findUnique({ where: { domain: data.domain.toLowerCase() } });
    if (duplicateWebsite && duplicateWebsite.id !== id) {
      throw new Error('A website with this domain already exists');
    }
  }

  return await prisma.website.update({
    where: { id },
    data: {
      name: data.name,
      domain: data.domain?.toLowerCase(),
      description: data.description,
      status: data.status,
    },
  });
};