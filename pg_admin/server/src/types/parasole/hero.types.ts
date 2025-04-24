export interface CreateHeroInput {
    title: string;
    description: string;
    index: number;
    image?: string;
    createdBy: string;
  }
  
  export interface UpdateHeroInput {
    title?: string;
    description?: string;
    index?: number;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }