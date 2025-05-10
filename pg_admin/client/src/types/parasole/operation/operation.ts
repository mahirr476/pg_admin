// operation.ts - Type definitions for Operation module

export interface OperationItem {
    id: number;
    title: string;
    description: string;
    index: number;
    images: string[];
    status: "ACTIVE" | "INACTIVE";
  }
  
  export interface OperationFormData {
    index: number;
    title: string;
    description: string;
    status: "ACTIVE" | "INACTIVE";
    images: File[];
  }
  
  export interface OperationState {
    operationData: OperationItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: OperationItem | null;
    formData: OperationFormData;
    previewImages: string[];
  }
  
  export interface UseOperationResult {
    // State
    operationData: OperationItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: OperationItem | null;
    formData: OperationFormData;
    previewImages: string[];
    
    // Actions
    fetchOperationData: () => Promise<void>;
    handleAddNew: () => void;
    handleEdit: (item: OperationItem) => void;
    handleInputChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
    handleStatusToggle: (item: OperationItem, newStatus: "ACTIVE" | "INACTIVE") => Promise<void>;
    closeModal: () => void;
  }