// buyer.ts - Type definitions for the Buyer module

export interface BuyerItem {
    id: number;
    title: string;
    description: string;
    index: number;
    images: string[];
    status: "ACTIVE" | "INACTIVE";
  }
  
  export interface BuyerFormData {
    index: number;
    title: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
    images: File[];
  }
  
  export interface BuyerState {
    buyerData: BuyerItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: BuyerItem | null;
    formData: BuyerFormData;
    previewImages: string[];
    error: string | null;
  }
  
  export interface UseBuyerResult {
    // State
    buyerData: BuyerItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: BuyerItem | null;
    formData: BuyerFormData;
    previewImages: string[];
    error: string | null;
    
    // Actions
    fetchBuyerData: () => Promise<void>;
    handleAddNew: () => void;
    handleEdit: (item: BuyerItem) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
    handleStatusToggle: (item: BuyerItem, newStatus: "ACTIVE" | "INACTIVE") => Promise<void>;
    closeModal: () => void;
  }