'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '../ui/card/Card'; 
import { MiButton } from '../ui/button/Button';
import { ArrowRight, ShoppingCart, Check } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import styles from './productSection.module.css';

interface ProductSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title = "Productos destacados",
  subtitle = "Lo mejor para tu perro, seleccionado con amor 💚",
  limit = 20, 
}) => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());

  const handleAddToCart = async (
    e: React.MouseEvent, 
    productId: string, 
    productName: string,
    productImage: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setLoadingProducts(prev => new Set(prev).add(productId));
      await addToCart(productId, 1);
      
      // Mostrar notificación con imagen
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={productImage}
            alt={productName}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <div>
            <strong>{productName}</strong>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              ¡Agregado al carrito! 
            </p>
          </div>
        </div>,
      );
      
      // Mostrar feedback visual en el botón
      setAddedProducts(prev => new Set(prev).add(productId));
      setTimeout(() => {
        setAddedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }, 2000);
      
    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      
      if (error.message.includes('Stock insuficiente')) {
        toast.error('❌ Lo sentimos, no hay suficiente stock disponible');
      } else {
        toast.error('❌ Error al agregar al carrito. Intenta de nuevo');
      }
    } finally {
      setLoadingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };
  
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </div>
        <div className={styles.loadingState}>
          <p>Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <p className={styles.error}>Error al cargar los productos. Por favor, intenta de nuevo.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <Link href="/products" passHref>
          <MiButton
            variant="ghost"
            text="Ver todos los productos"
            icon={<ArrowRight size={20} />}
            iconPosition="right"
          />
        </Link>
      </div>

      <div className={styles.grid}>
        {products.slice(0, limit).map((product) => {
          const isAdded = addedProducts.has(product._id);
          const isLoading = loadingProducts.has(product._id);
          const productImage = product.mainImage?.url || product.images?.[0]?.url || '/images/placeholder.jpg';
          
          return (
            <Link 
              key={product._id}
              href={`/products/${product._id}`} 
              className={styles.cardLink}
            >
              <div className={styles.cardWrapper}>
                <Card
                  title={product.name}
                  description={product.brand}
                  price={product.price.toString()}
                  originalPrice={product.originalPrice?.toString()}
                  image={productImage}
                  rating={product.rating}
                  stock={product.quantity}
                  badges={product.quantity < 10 && product.quantity > 0 ? ['Poco Stock'] : undefined}
                >
                  <MiButton
                    variant={isAdded ? "ghost" : "primary"}
                    text={isAdded ? "Añadido" : isLoading ? "Añadiendo..." : "Agregar"}
                    icon={isAdded ? <Check size={18} /> : <ShoppingCart size={18} />}
                    fullWidth
                    disabled={isLoading || product.quantity === 0}
                    onClick={(e) => handleAddToCart(e, product._id, product.name, productImage)}
                  />
                </Card>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};