'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImageUploader } from '@/components/ProductImageUploader';
import { MiButton } from '@/components/ui/button/Button';
import { productService } from '@/services/product';
import type { ProductFormData, UploadedImage } from '@/services/product';
import styles from './ProductForm.module.css';
import { TrashIcon } from '@heroicons/react/24/outline';

// Categorías por defecto
const DEFAULT_CATEGORIES = [
  { value: 'food', label: 'Alimento' },
  { value: 'clothing', label: 'Ropa' },
  { value: 'accessories', label: 'Accesorios' },
  { value: 'toys', label: 'Juguetes' },
];

type ProductDataWithId = ProductFormData & { _id?: string };

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
  initialData?: ProductDataWithId | null;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onSuccess, 
  onCancel,
  onDelete,
  initialData,
  isEditing = false
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    quantity: 0,
    images: [],
    mainImage: null,
  });

  // Cargar categorías y datos iniciales
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const realCategories = await productService.getCategories();
            const newOptions = [...DEFAULT_CATEGORIES];
            
            realCategories.forEach(cat => {
                const exists = newOptions.some(opt => opt.value === cat);
                if (!exists) {
                    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
                    newOptions.push({ value: cat, label });
                }
            });
            setCategoryOptions(newOptions);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    fetchCategories();

    if (isEditing && initialData) {
      setFormData({
        name: initialData.name || '',
        brand: initialData.brand || '',
        category: initialData.category || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        quantity: initialData.quantity || 0,
        images: initialData.images || [],
        mainImage: initialData.mainImage || null,
      });
    }
  }, [isEditing, initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleImagesChange = (data: {
    images: UploadedImage[];
    mainImage: UploadedImage | null
  }) => {
    setFormData(prev => ({
      ...prev,
      images: data.images,
      mainImage: data.mainImage,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.brand || !formData.price) {
      alert('Por favor completa todos los campos obligatorios');
      return false;
    }
    if (formData.images.length === 0) {
      alert('Debes subir al menos una imagen');
      return false;
    }
    return true;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      brand: '',
      category: '',
      description: '',
      price: 0,
      quantity: 0,
      images: [],
      mainImage: null,
    });
  };

  // --- AQUÍ ESTÁ LA CORRECCIÓN IMPORTANTE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. PREPARAR DATOS LIMPIOS (Sanitización)
      // Esto evita el Error 400 enviando solo lo que la API espera
      const payload = {
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        price: Number(formData.price), // Asegurar que es número
        quantity: Number(formData.quantity), // Asegurar que es número
        // Limpiar array de imágenes (quitar _id u otros campos de DB)
        images: formData.images.map(img => ({
          url: img.url,
          publicId: img.publicId
        })),
        // Limpiar mainImage
        mainImage: formData.mainImage ? {
          url: formData.mainImage.url,
          publicId: formData.mainImage.publicId
        } : null
      };

      console.log("Enviando payload limpio:", payload);

      if (isEditing && initialData?._id) {
        // --- EDICIÓN ---
        // Enviamos 'payload', NO 'formData'
        await productService.updateProduct(initialData._id, payload);
        alert('Producto actualizado exitosamente');
      } else {
        // --- CREACIÓN ---
        // Enviamos 'payload', NO 'formData'
        await productService.createProduct(payload);
        alert('Producto creado exitosamente');
        handleReset();
      }
      
      if (onSuccess) {
        onSuccess();
      }
            
    } catch (error: any) {
      console.error('Error en submit:', error);
      // Intentamos mostrar un mensaje más detallado si axios lo devuelve
      const errorMsg = error.response?.data?.error || error.message || 'Ocurrió un error inesperado';
      const errorDetails = error.response?.data?.details ? JSON.stringify(error.response.data.details) : '';
      
      alert(`${isEditing ? 'Error al actualizar' : 'Error al crear'}: ${errorMsg} ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (isEditing && initialData?._id && onDelete) {
        // Confirmación nativa
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            onDelete(initialData._id);
        }
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          {onCancel && (
            <MiButton
              variant="secondary"
              text="Cancelar"
              onClick={onCancel}
              type="button"
            />
          )}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Información Básica</h3>
          
           <div className={styles.formField}>
            <label className={styles.label}>Nombre <span className={styles.required}>*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={styles.input} required />
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formField}>
                <label className={styles.label}>Marca <span className={styles.required}>*</span></label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className={styles.input} required />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>
                Categoría
                <span className={styles.required}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
           <div className={styles.formField}>
            <label className={styles.label}>Descripción <span className={styles.required}>*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className={styles.textarea} rows={4} required />
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.priceSection}`}>
          <h3 className={styles.sectionTitle}>Precio e Inventario</h3>
          <div className={styles.priceGrid}>
            <div className={`${styles.formField} ${styles.priceField}`}>
              <label className={styles.label}>Precio <span className={styles.required}>*</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className={`${styles.input} ${styles.numberInput}`} min={0} step="0.01" required />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Stock <span className={styles.required}>*</span></label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className={`${styles.input} ${styles.numberInput}`} min={0} required />
            </div>
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.imageSection}`}>
          <h3 className={styles.sectionTitle}>Imágenes</h3>
          <ProductImageUploader 
            onImagesChange={handleImagesChange}
            maxImages={5}
            existingImages={formData.images}
            existingMainImage={formData.mainImage}
          />
        </div>

        <div className={styles.actionButtons}>
          <MiButton
            type="submit"
            disabled={loading}
            variant="primary"
            text={loading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
            className={styles.primaryButton}
          />
          
          {isEditing && onDelete && (
             <MiButton
                type="button"
                variant="danger"
                text="Eliminar Producto"
                icon={<TrashIcon className="w-5 h-5"/>}
                onClick={handleDeleteClick}
                className={styles.deleteButton}
             />
          )}
          
          {!isEditing && (
            <MiButton
              type="button"
              onClick={handleReset}
              disabled={loading}
              variant="secondary"
              text="Limpiar"
            />
          )}
        </div>
      </form>
    </div>
  );
};