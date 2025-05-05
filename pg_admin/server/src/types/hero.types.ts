export interface CreateHeroInput {
    title: string;
    description: string;
    index: number;
    images?: string[];
    createdBy: string;
  }
  
  export interface UpdateHeroInput {
    title?: string;
    description?: string;
    images?: string[];
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }