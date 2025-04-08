

export interface CreateCSRInput {
  title: string;
  description: string;
  orderIndex: number;
  createdBy: string;
  updatedBy?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCSRInput {
  title?: string;
  description?: string;
  orderIndex?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  updatedBy: string;
}