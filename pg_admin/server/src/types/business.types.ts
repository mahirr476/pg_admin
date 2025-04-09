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

  export interface CreateOperationInput {
    businessId: number;
    title: string;
    description: string;
    createdBy: string;
  }


  export interface UpdateOperationInput {
    businessId: number;
    title?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
    updatedAt: Date;
  }

  export interface CreateProductInput {
    businessId: number;
    title: string;
    description: string;
    createdBy: string;
  }

  export interface UpdateProductInput {
    businessId?: number;
    title?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
    updatedAt: Date;
  }

  export interface CreateUnitInput {
    businessId: number;
    title: string;
    description: string;
    createdBy: string;
  }
  
  export interface UpdateUnitInput {
    businessId?: number;
    title?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
    updatedAt: Date;
  }

  export interface CreateCertificationInput {
    businessId: number;
    title: string;
    description: string;
    image: string;
    createdBy: string;
  }
  
  export interface UpdateCertificationInput {
    businessId?: number;
    title?: string;
    description?: string;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
    updatedAt: Date;
  }
  