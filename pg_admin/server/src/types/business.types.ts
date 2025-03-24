// src/types/business.types.ts
export interface CreateBusinessInput {
    title: string;
    bannerImage: string;
    shortDes: string;
    longDes: string;
    videoLink?: string;
    image?: string;
    createdBy: string;
  }
  
  export interface UpdateBusinessInput {
    title?: string;
    bannerImage?: string;
    shortDes?: string;
    longDes?: string;
    videoLink?: string;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }
  