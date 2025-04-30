export interface CreateContactInput {
    title: string;
    description: string;
    image?: string | null;
    index: number;
    createdBy: string;
}

export interface UpdateContactInput {
    title?: string;
    description?: string;
    image?: string | null;
    index?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
}