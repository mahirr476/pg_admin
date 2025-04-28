// types/parasole/about/about.ts
export interface AboutItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    images: string[];
    index: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface AboutFormData {
    index: number | string;
    title: string;
    description: string;
    images: File[];
  }
  
  export interface AboutResponse {
    success: boolean;
    message: string;
    data: AboutItem[];
  }