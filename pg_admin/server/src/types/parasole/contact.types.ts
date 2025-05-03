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

export interface ContactFormInput {
    name: string;
    organization: string;
    email: string;
    phone: string;
    type: string;
    message: string;
}