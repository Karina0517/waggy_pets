'use client'; 

import React from 'react';
import Link from 'next/link';
import { Card } from '../ui/card/Card'; 
import { MiButton } from '../ui/button/Button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts'; 
// import { ProductCardSkeleton } from '../product-card-skeleton/ProductCardSkeleton';
import styles from './productSection.module.css';

interface ProductSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number; // limitar el número de productos a mostrar
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  title = "Productos destacados",
  subtitle = "Lo mejor para tu perro, seleccionado con amor 💚",
  limit = 20, 
}) => {
  const { products, loading, error } = useProducts();

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    console.log(`Añadido al carrito: ${productName}`);
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
        {/* <div className={styles.grid}>
          {[...Array(limit)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div> */}
      </section>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <section className={styles.section}>
        <p className={styles.error}>Error al cargar los productos. Por favor, intenta de nuevo.</p>
      </section>
    );
  }

  // 6. Mapear y mostrar los productos reales
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
        {products.slice(0, limit).map((product) => (
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
                image={product.mainImage?.url || product.images?.[0]?.url || '/images/placeholder.jpg'}
                rating={product.rating}
                stock={product.quantity}
                badges={product.quantity < 10 && product.quantity > 0 ? ['Poco Stock'] : undefined}
              >
                <MiButton
                  variant="primary"
                  text="Agregar"
                  icon={<ShoppingCart size={18} />}
                  fullWidth
                  onClick={(e) => handleAddToCart(e, product.name)}
                />
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};