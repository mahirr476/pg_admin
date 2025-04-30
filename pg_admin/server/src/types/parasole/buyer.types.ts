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

export interface CreateBuyerDetailInput {
    buyerId: number;
    title: string;
    description: string;
    type: string;
    year: string;
    index: number;
    image: string;
    createdBy: string;
}

export interface UpdateBuyerDetailInput {
    buyerId?: number;
    title?: string;
    description?: string;
    type?: string;
    year?: string;
    index?: number;
    image?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}