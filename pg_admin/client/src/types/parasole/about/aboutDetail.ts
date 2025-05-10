// types/parasole/about/aboutDetail.ts
export interface AboutOption {
  id: number;
  title: string;
  slug: string;
  description: string;
  images: string[];
  index: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  status: string;
}

export interface AboutDetail {
  id: number;
  aboutId: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  link: string;
  index: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string;
  status: string;
  about?: {
    title: string;
  };
}

export interface AboutDetailFormData {
  id: string | number;
  aboutId: string | number;
  title: string;
  description: string;
  image: File | null;
  link: string;
  index: string | number;
  status: string;
}

export type SortDirection = "asc" | "desc";
export type SortableColumn = keyof AboutDetail;