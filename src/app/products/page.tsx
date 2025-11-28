'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts, ProductFilters as FilterValues } from '@/hooks/useProducts';
import { ProductFilters } from '@/components/ProductFilters';
import { Pagination } from '@/components/Pagination';
import { Card } from '@/components/ui/card/Card';
import { MiButton } from '@/components/ui/button/Button';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-toastify';
import styles from './products.module.css';

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    pagination,
    filters: availableFilters,
    setFilters,
    goToPage
  } = useProducts();

  const { addToCart } = useCart();

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleAddToCart = async (
    e: React.MouseEvent,
    productId: string,
    productName: string,
    productImage: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart(productId, 1);

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
              ¡Agregado al carrito! 🎉
            </p>
          </div>
        </div>,
      );
    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);

      if (error.message.includes('Stock insuficiente')) {
        toast.error(' Lo sentimos, no hay suficiente stock disponible');
      } else {
        toast.error(' Error al agregar al carrito. Intenta de nuevo');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>
        <h1 className={styles.title}>Todos los productos</h1>
        <p className={styles.subtitle}>
          {pagination
            ? `${pagination.totalProducts} productos disponibles`
            : 'Cargando...'}
        </p>
      </div>

      {/* Filtros */}
      <ProductFilters
        onFilterChange={handleFilterChange}
        availableCategories={availableFilters?.categories}
        availableBrands={availableFilters?.brands}
      />

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando productos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <p> {error}</p>
          <MiButton
            variant="primary"
            text="Reintentar"
            onClick={() => window.location.reload()}
          />
        </div>
      )}

      {/* Sin resultados */}
      {!loading && !error && products.length === 0 && (
        <div className={styles.empty}>
          <Package size={64} className={styles.emptyIcon} />
          <h2>No se encontraron productos</h2>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Grid de productos */}
      {!loading && !error && products.length > 0 && (
        <>
          <div className={styles.grid}>
            {products.map((product) => {
              const productImage =
                product.mainImage?.url ||
                product.images?.[0]?.url ||
                '/images/placeholder.jpg';

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
                      badges={
                        product.quantity < 10 && product.quantity > 0
                          ? ['Poco Stock']
                          : undefined
                      }
                    >
                      <MiButton
                        variant="primary"
                        text="Agregar"
                        icon={<ShoppingCart size={18} />}
                        fullWidth
                        disabled={product.quantity === 0}
                        onClick={(e) =>
                          handleAddToCart(
                            e,
                            product._id,
                            product.name,
                            productImage
                          )
                        }
                      />
                    </Card>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Paginación */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              totalProducts={pagination.totalProducts}
            />
          )}
        </>
      )}
    </div>
  );
}