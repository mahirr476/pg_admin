export interface CreateMediaInput {
    title: string;
    orderIndex: number;
    description: string;
    createdBy: string;
  }
  
  export interface UpdateMediaInput {
    title?: string;
    orderIndex?: number;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }

  export interface CreateGalleryInput {
    title: string;
    description: string;
    image: string;
    link: string;
    createdBy: string;
  }
  
  export interface UpdateGalleryInput {
    title?: string;
    description?: string;
    image?: string;
    link?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }