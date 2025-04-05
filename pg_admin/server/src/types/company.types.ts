export interface CreateCompanyInput {
    title: string;
    image: string;
    shortDes: string;
    longDes: string;
    founded: string;
    teamSize: string;
    location: string;
    category: string;
    globalPresence: string;
    revenue: string;
    clientSatisfaction: string;
    createdBy: string;
  }
  
  export interface UpdateCompanyInput {
    title?: string;
    image?: string;
    shortDes?: string;
    longDes?: string;
    founded?: string;
    teamSize?: string;
    location?: string;
    category?: string;
    globalPresence?: string;
    revenue?: string;
    clientSatisfaction?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    updatedBy: string;
  }