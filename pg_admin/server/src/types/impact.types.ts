export interface CreateImpactInput {
    title: string;
    description: string;
    number: string;
    createdBy: string;
}

export interface UpdateImpactInput {
    title?: string;
    description?: string;
    number?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}