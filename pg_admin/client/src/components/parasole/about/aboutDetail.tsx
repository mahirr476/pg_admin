

// components/parasole/about/AboutDetail.tsx
import React, { useState } from 'react';
import { Plus, LayoutList } from 'lucide-react';
import { useAboutDetail } from '../../../hooks/parasole/about/use-aboutDetail';
import AboutDetailTable from './aboutDetailTable';
import AboutDetailForm from './aboutDetailForm';
import { AboutDetail as AboutDetailType, AboutDetailFormData } from '../../../types/parasole/about/aboutDetail';

const AboutDetail: React.FC = () => {
  const {
    aboutDetails,
    aboutOptions,
    isLoading,
    expandedDescription,
    highlightedRow,
    sortBy,
    sortDirection,
    showDeleteConfirm,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handleSort,
    getSortedItems,
    toggleDescription,
    setHighlightedRow,
    setShowDeleteConfirm
  } = useAboutDetail();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<AboutDetailFormData>({
    id: '',
    aboutId: '',
    title: '',
    description: '',
    image: null,
    link: '',
    index: '',
    status: 'ACTIVE'
  });

  // Handler for opening modal (for create or edit)
  const handleOpenModal = (isEditMode = false, detail: AboutDetailType | null = null): void => {
    if (isEditMode && detail) {
      setFormData({
        id: detail.id,
        aboutId: detail.aboutId,
        title: detail.title,
        description: detail.description,
        image: null, // We can't pre-fill the file input
        link: detail.link,
        index: detail.index,
        status: detail.status
      });
      setIsEdit(true);
    } else {
      // Reset form for a new entry
      setFormData({
        id: '',
        aboutId: '',
        title: '',
        description: '',
        image: null,
        link: '',
        index: '',
        status: 'ACTIVE'
      });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  // Handler for closing modal
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  // Handler for form submission
  const handleFormSubmit = async (data: AboutDetailFormData): Promise<void> => {
    const success = await handleSubmit(data, isEdit);
    if (success) {
      handleCloseModal();
    }
  };

  // Handler for delete confirmation
  const handleConfirmDelete = (id: number) => {
    setShowDeleteConfirm(id);
  };

  // Handler for cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Get sorted items
  const sortedItems = getSortedItems();

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="bg-blue-100 p-2 rounded-md mr-2 inline-block">
              <LayoutList className="h-5 w-5 text-blue-600" />
            </span>
            About Details
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {aboutDetails.length} item{aboutDetails.length !== 1 ? 's' : ''}
            </span>
            <button 
              onClick={() => handleOpenModal(false)}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          </div>
        </div>
        
        <AboutDetailTable
          aboutDetails={sortedItems}
          isLoading={isLoading}
          expandedDescription={expandedDescription}
          highlightedRow={highlightedRow}
          sortBy={sortBy}
          sortDirection={sortDirection}
          showDeleteConfirm={showDeleteConfirm}
          onEdit={(item) => handleOpenModal(true, item)}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onSort={handleSort}
          onToggleDescription={toggleDescription}
          onSetHighlightedRow={setHighlightedRow}
          onConfirmDelete={handleConfirmDelete}
          onCancelDelete={handleCancelDelete}
        />
        
        {aboutDetails.length > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Sorted by <span className="font-medium">{sortBy}</span> ({sortDirection === "asc" ? "ascending" : "descending"})
            </span>
            <span className="text-xs text-gray-500">
              {aboutDetails.length} item{aboutDetails.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AboutDetailForm
        isOpen={isModalOpen}
        isEdit={isEdit}
        formData={formData}
        aboutOptions={aboutOptions}
        isLoading={isLoading}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AboutDetail;