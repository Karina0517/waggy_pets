import React from 'react';
import { ProductForm } from '@/components/ProductForm';
import styles from './modal.module.css';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any; 
  isEditing?: boolean; 
  onDelete?: (id: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData, 
  isEditing,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <ProductForm 
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={onClose}
          initialData={initialData}
          isEditing={isEditing}    
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};