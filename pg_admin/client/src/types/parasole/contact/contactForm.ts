// contactForm.ts - Type definitions for the Contact Form

// Interface for contact form submission
export interface Submission {
    id?: string | number;
    name: string;
    organization: string;
    email: string;
    phone: string;
    type: string;
    message: string;
    createdAt?: string;
  }
  
  // API response interface
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  // Modal states interface
  export interface ModalStates {
    showViewModal: boolean;
    showDeleteModal: boolean;
    deleteLoading: boolean;
    selectedSubmission: Submission | null;
  }
  
  // Base API URL
  export const API_BASE_URL = 'http://localhost:7000/api/v1/parasole';