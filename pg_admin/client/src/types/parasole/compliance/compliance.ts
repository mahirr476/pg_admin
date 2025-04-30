// compliance.ts - Type definitions for the Compliance module

export interface ComplianceItem {
  id: string;
  index: number;
  title: string;
  description: string;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ComplianceFormData {
  index: string;
  title: string;
  description: string;
  images: File[];
}

export interface ComplianceState {
  complianceData: ComplianceItem[];
  isModalOpen: boolean;
  isLoading: boolean;
  selectedItem: ComplianceItem | null;
  formData: ComplianceFormData;
  previewImages: string[];
}

export interface UseComplianceResult {
  // State
  complianceData: ComplianceItem[];
  isModalOpen: boolean;
  isLoading: boolean;
  selectedItem: ComplianceItem | null;
  formData: ComplianceFormData;
  previewImages: string[];
  
  // Actions
  fetchComplianceData: () => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddNew: () => void;
  handleEdit: (item: ComplianceItem) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleStatusToggle: (item: ComplianceItem, newStatus: 'ACTIVE' | 'INACTIVE') => Promise<void>;
  closeModal: () => void;
}