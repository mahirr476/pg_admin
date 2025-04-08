export interface CreateImpactInput {
    title: string;
    description: string;
    number: number;
    createdBy: string;
}

export interface UpdateImpactInput {
    title?: string;
    description?: string;
    number?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}