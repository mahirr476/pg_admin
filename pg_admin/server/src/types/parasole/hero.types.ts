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

  export interface CreateHeroDetailInput {
    heroId: number;
    title: string;
    description: string;
    image?: string;
    index: number;
    createdBy: string;
}

export interface UpdateHeroDetailInput {
    heroId?: number;
    title?: string;
    description?: string;
    image?: string;
    index?: number;
    updatedBy: string;
    status?: 'ACTIVE' | 'INACTIVE';
}