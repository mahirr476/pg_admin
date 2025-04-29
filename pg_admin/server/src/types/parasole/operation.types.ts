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

  export interface CreateComplianceDetailInput {
    complianceId: number;
    title: string;
    description: string;
    shortDescrip?: string | null;
    image?: string;
    index: number;
    createdBy: string;
}

export interface UpdateComplianceDetailInput {
    complianceId?: number;
    title?: string;
    description?: string;
    shortDescrip?: string | null;
    image?: string;
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}