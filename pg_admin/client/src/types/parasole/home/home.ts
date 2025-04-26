// types/parasole/home/home.ts
export interface HeroItem {
  id: number;
  title: string;
  description: string;
  image: string;
  index: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface HeroItemFormData {
  title: string;
  description: string;
  image?: File | null;
  index: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: HeroItem | HeroItem[] | null;
}