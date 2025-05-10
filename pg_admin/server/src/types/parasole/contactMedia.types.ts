
// export interface CreateContactMediaInput {
//     title?: string;
//     description?: string;
//     facebook?: string;
//     instagram?: string;
//     twitter?: string;
//     linkedin?: string;
//     youtube?: string;
//     tiktok?: string;
//     telegram?: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     map?: string;
//     createdBy?: string;
//   }
  
//   export interface UpdateContactMediaInput {
//     title?: string;
//     description?: string;
//     facebook?: string;
//     instagram?: string;
//     twitter?: string;
//     linkedin?: string;
//     youtube?: string;
//     tiktok?: string;
//     telegram?: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     map?: string;
//     updatedBy?: string;
//   }


// Types for ContactMedia

export interface UpsertContactMediaInput {
  title: string;
  description?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  telegram?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  map?: string | null;
  userName: string; // Used for createdBy/updatedBy
}

export interface ContactMediaResponse {
  id: number;
  title: string;
  description: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
  tiktok: string | null;
  telegram: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  map: string | null;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
}