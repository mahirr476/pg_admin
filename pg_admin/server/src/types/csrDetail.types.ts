
export interface CreateCsrDetailInput {
    csr_id: number;
    title: string;
    description: string;
    image?: string | null;
    createdBy: string;
}

export interface UpdateCsrDetailInput {
  csr_id?: number;
  title?: string;
  description?: string;
  image?: string | null;
  status?: 'ACTIVE' | 'INACTIVE';
  updatedBy: string;
}