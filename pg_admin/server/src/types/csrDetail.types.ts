
export interface CreateCsrDetailInput {
    csr_id: number;
    title: string;
    description: string;
    image?: string;
    createdBy: string;
}

export interface UpdateCsrDetailInput {
  title?: string;
  description?: string;
  image?: string;
  csr_id?: number;
  updatedBy: string;
}