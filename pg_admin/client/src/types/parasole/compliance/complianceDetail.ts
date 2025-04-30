// complianceDetail.ts - Type definitions for Compliance Detail module

export interface ComplianceItem {
    id: string;
    title: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface ComplianceDetailItem {
    id: string;
    index: number;
    title: string;
    description: string;
    shortDescrip: string;
    complianceId: string;
    status: 'ACTIVE' | 'INACTIVE';
  }
  
  export interface ComplianceDetailFormData {
    index: string;
    title: string;
    description: string;
    shortDescrip: string;
    complianceId: string;
  }
  
  export interface ComplianceDetailState {
    data: ComplianceDetailItem[];
    compliances: ComplianceItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: ComplianceDetailItem | null;
    formData: ComplianceDetailFormData;
  }
  
  export interface UseComplianceDetailResult {
    // State
    data: ComplianceDetailItem[];
    compliances: ComplianceItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: ComplianceDetailItem | null;
    formData: ComplianceDetailFormData;
    
    // Actions
    fetchComplianceDetails: () => Promise<void>;
    fetchCompliances: () => Promise<void>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    openModal: (item?: ComplianceDetailItem | null) => void;
    closeModal: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    handleStatusToggle: (item: ComplianceDetailItem, newStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>;
    getComplianceTitle: (id: string) => string;
  }