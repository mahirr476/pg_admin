export interface CreateHeroInput {
    title: string;
    description: string;
    index: number;
    createdBy: string;
  }
  
  export interface UpdateHeroInput {
    title?: string;
    description?: string;
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }