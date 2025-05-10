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

export interface CreateAboutDetailInput {
    aboutId: number;
    title: string;
    description: string;
    image?: string;
    link?: string;
    index?: number;
    createdBy: string;
}

export interface UpdateAboutDetailInput {
    aboutId?: number;
    title?: string;
    description?: string;
    image?: string;
    link?: string;
    index?: number| null;
    updatedBy: string;
    status?: 'ACTIVE' | 'INACTIVE';
}
