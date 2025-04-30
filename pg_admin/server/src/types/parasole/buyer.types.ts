export interface CreateBuyerInput {
    title: string;
    description: string;
    images?: string[];
    index: number;
    createdBy: string;
}

export interface UpdateBuyerInput {
    title?: string;
    description?: string;
    images?: string[];
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}