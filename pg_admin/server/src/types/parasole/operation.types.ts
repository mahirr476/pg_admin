export interface CreateOperationInput {
    title: string;
    description: string;
    images?: string[];
    index: number;
    createdBy: string;
  }
  
  export interface UpdateOperationInput {
    title?: string;
    description?: string;
    images?: string[];
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }

  export interface CreateOperationDetailInput {
    operationId: number;
    title: string;
    description: string;
    index: number;
    createdBy: string;
}

export interface UpdateOperationDetailInput {
    operationId?: number;
    title?: string;
    description?: string;
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}