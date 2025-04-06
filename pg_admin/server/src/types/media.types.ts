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