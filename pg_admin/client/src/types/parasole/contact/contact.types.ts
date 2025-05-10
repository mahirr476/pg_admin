export interface ContactItem {
    id: number;
    title: string;
    slug: string;
    index: number;
    description: string;
    image: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    status: "ACTIVE" | "INACTIVE";
  }
  
  export interface FormData {
    index: string;
    title: string;
    description: string;
    image: File | null;
    status: "ACTIVE" | "INACTIVE";
  }
  
  export type StatusType = "ACTIVE" | "INACTIVE";
  
  export interface ContactState {
    data: ContactItem[];
    isModalOpen: boolean;
    isLoading: boolean;
    selectedItem: ContactItem | null;
    formData: FormData;
    previewImage: string;
    error: string | null;
  }
  
  export interface ContactActions {
    fetchContactData: () => Promise<void>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    openModal: (item?: ContactItem | null) => void;
    closeModal: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
    handleStatusToggle: (item: ContactItem, newStatus: StatusType) => Promise<void>;
  }