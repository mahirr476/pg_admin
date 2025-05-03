// Types related to buyer details management

// Define interfaces for our data types
export interface BuyerItem {
    id: number;
    title: string;
    description: string;
    image: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface BuyerDetailItem {
    id: number;
    buyerId: number;
    title: string;
    slug: string;
    index: number;
    description: string;
    image: string;
    type: string;
    year: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  // Renamed from FormData to BuyerDetailFormData to avoid conflict with browser's FormData
  export interface BuyerDetailFormData {
    index: string;
    title: string;
    description: string;
    buyerId: string;
    type: string;
    year: string;
    image: File | null;
  }
  
  export type StatusType = 'ACTIVE' | 'INACTIVE';
  
  // API response types
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
  }