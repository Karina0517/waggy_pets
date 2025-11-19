'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImageUploader } from '@/components/ProductImageUploader';
import { FormField } from '@/components/FormField';
import { MiButton } from '@/components/ui/button/Button';
import { productService } from '@/services/product';
import type { ProductFormData, UploadedImage } from '@/services/product';
import styles from './ProductForm.module.css';

const CATEGORIES = [
  { value: 'food', label: 'Alimento' },
  { value: 'clothing', label: 'Ropa' },
  { value: 'accessories', label: 'Accesorios' },
  { value: 'toys', label: 'Juguetes' },
];

interface ProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await productService.createProduct(formData);
      console.log('Producto creado:', result);
      
      alert('Producto creado exitosamente');
      handleReset();
      
      if (onSuccess) {
        onSuccess();
        router.push('/');
      }
            
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Crear Nuevo Producto</h2>
          {onCancel && (
            <MiButton
              variant="secondary"
              text="Cancelar"
              click={onCancel}
            />
          )}
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Información Básica</h3>
          
          <div className={styles.formField}>
            <label className={styles.label}>
              Nombre del producto
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Ej: Alimento Premium para Perros"
              required
            />
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formField}>
              <label className={styles.label}>
                Marca
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ej: Dog Show"
                required
              />
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
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>
              Descripción
              <span className={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Describe el producto detalladamente..."
              rows={4}
              required
            />
            <p className={styles.helpText}>
              Describe las características principales del producto
            </p>
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.priceSection}`}>
          <h3 className={styles.sectionTitle}>Precio e Inventario</h3>
          
          <div className={styles.priceGrid}>
            <div className={`${styles.formField} ${styles.priceField}`}>
              <label className={styles.label}>
                Precio
                <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`${styles.input} ${styles.priceInput} ${styles.numberInput}`}
                min={0}
                step="0.01"
                required
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>
                Cantidad en Stock
                <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`${styles.input} ${styles.numberInput}`}
                min={0}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${styles.formSection} ${styles.imageSection}`}>
          <h3 className={styles.sectionTitle}>Imágenes del Producto</h3>
          <ProductImageUploader 
            onImagesChange={handleImagesChange}
            maxImages={5}
          />
        </div>

        <div className={styles.actionButtons}>
          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Creando producto...
              </span>
            ) : (
              'Crear Producto'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={styles.secondaryButton}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};