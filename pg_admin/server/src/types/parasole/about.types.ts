export interface CreateAboutInput {
    title: string;
    description: string;
    index: number;
    images?: string[];
    createdBy: string;
  }
  
  export interface UpdateAboutInput {
    title?: string;
    description?: string;
    index?: number;
    images?: string[];
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }