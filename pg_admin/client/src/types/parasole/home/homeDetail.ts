// types/parasole/home/homeDetail.ts

export interface Hero {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    index: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    status: string;
  }
  
  export interface HeroDetail {
    id: number;
    heroId: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    index: number;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    status: string;
    hero?: {
      title: string;
    };
  }
  
  export interface HeroDetailFormData {
    heroId: string;
    title: string;
    description: string;
    image: File | null;
    index: number;
    status: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }