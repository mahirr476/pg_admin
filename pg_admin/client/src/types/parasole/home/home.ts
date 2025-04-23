// types/parasole/home/home.ts
export interface HomePageItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    status: "active" | "inactive";
  }
  
  export interface HomePageItemFormData {
    title: string;
    description: string;
    imageUrl: string;
    status: "active" | "inactive";
  }