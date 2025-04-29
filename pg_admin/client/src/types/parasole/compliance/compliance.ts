// types/parasole/compliance/compliance.ts

export interface Compliance {
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
  
  export interface ComplianceFormData {
    id?: number;
    title: string;
    description: string;
    index: number;
    image?: File | null;
    status?: 'ACTIVE' | 'INACTIVE';
  }
  
  export type SortableColumn = 'id' | 'title' | 'index' | 'createdAt' | 'status';
  export type SortDirection = 'asc' | 'desc';