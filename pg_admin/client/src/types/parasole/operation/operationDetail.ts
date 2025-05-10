// operationDetail.ts - Type definitions for Operation Detail module

export interface OperationItem {
    id: number;
    title: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface OperationDetailItem {
    id: number;
    operationId: number;
    title: string;
    slug: string;
    index: number;
    description: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface OperationDetailFormData {
    index: string;
    title: string;
    description: string;
    operationId: string;
  }
  
  export interface OperationDetailState {
    data: OperationDetailItem[];
    operations: OperationItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: OperationDetailItem | null;
    formData: OperationDetailFormData;
  }
  
  export interface UseOperationDetailResult {
    // State
    data: OperationDetailItem[];
    operations: OperationItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: OperationDetailItem | null;
    formData: OperationDetailFormData;
    
    // Actions
    fetchOperationDetails: () => Promise<void>;
    fetchOperations: () => Promise<void>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    openModal: (item?: OperationDetailItem | null) => void;
    closeModal: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
    handleStatusToggle: (item: OperationDetailItem, newStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>;
    getOperationTitle: (id: number) => string;
  }