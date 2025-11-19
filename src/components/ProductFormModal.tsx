// components/molecules/ProductFormModal.tsx
import { ProductForm } from '@/components/ProductForm';
import styles from './modal.module.css';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess
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
        />
      </div>
    </div>
  );
};