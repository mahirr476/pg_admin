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

  export interface CreateNewsInput {
    title: string;
    description: string;
    image: string;
    link: string;
    tag: string;
    date: string;
    createdBy: string;
  }
  
  export interface UpdateNewsInput {
    title?: string;
    description?: string;
    image?: string;
    link?: string;
    tag?: string;
    date?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }

  export interface MediaInqueryData {
    title: string;
    description: string;
    email: string;
    contactNo: string;
    website: string;
  }

  export interface MediaContactInput {
    name: string;
    organization: string;
    email: string;
    phone: string;
    type: string;
    message: string;
  }