// src/types/milestone.types.ts
export interface CreateMilestoneInput {
    title: string;
    description: string;
    orderIndex: number;
    createdBy: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface UpdateMilestoneInput {
    title?: string;
    description?: string;
    orderIndex?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }
  
  export interface MilestoneResponse {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    createdBy: string;
    status: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
  }