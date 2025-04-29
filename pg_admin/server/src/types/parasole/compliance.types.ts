export interface CreateComplianceInput {
    title: string;
    description: string;
    images?: string[];
    index: number;
    createdBy: string;
  }
  
  export interface UpdateComplianceInput {
    title?: string;
    description?: string;
    images?: string[];
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }