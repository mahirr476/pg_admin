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
    slug?: string;
    shortDes?: string;
    longDes?: string;
    videoLink?: string;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }
  
  export interface BusinessResponse {
    id: number;
    title: string;
    bannerImage: string;
    bannerImageUrl?: string;
    slug: string;
    shortDes: string;
    longDes: string;
    videoLink?: string;
    image?: string;
    imageUrl?: string;
    createdBy: string;
    status: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
    details?: any[];
  }