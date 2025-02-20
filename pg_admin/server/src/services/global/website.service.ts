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




import { global } from '../../config/db.config';

type WebsiteData = {
        name: string;
        domain: string;
        description: string;
      };

export const createWebsite = async (data: WebsiteData) => {
  
    // Normalize the domain to lowercase
  const normalizedDomain = data.domain.toLowerCase();

    // Check if the domain already exists
  const existingWebsite = await global.website.findUnique({ where: { domain: normalizedDomain } });
  if (existingWebsite) {
    throw new Error('A website with this domain already exists');
  }

  return await global.website.create({
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
    return await global.website.findMany();
  };