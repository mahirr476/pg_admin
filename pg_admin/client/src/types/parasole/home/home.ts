// types/parasole/home/home.ts

export type Status = "ACTIVE" | "INACTIVE";

export interface HeroItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  index: number | string;
  status: Status;
}

export interface HeroItemFormData {
  title: string;
  description: string;
  image: File | null;
  images?: File[] | null;  // New field for multiple images
  index: number;
  status: Status;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: HeroItem | HeroItem[] | null;
}