
export interface CreateMilestoneDetailInput {
    year: string;
    title: string;
    description: string;
    image: string;
    createdBy: string;
  }
  
  export interface UpdateMilestoneDetailInput {
    year?: string;
    title?: string;
    description?: string;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }
  
  export interface MilestoneDetailResponse {
    id: number;
    year: string;
    title: string;
    description: string;
    image: string;
    createdBy: string;
    status: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
  }