// app/page.tsx (con modal)
'use client';

import { MiButton } from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import { ProductFormModal } from '@/components/ProductFormModal';
import styles from './page.module.css';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';

export default function Home() {
  const { products, loading, error, refetch } = useProducts();
  const [showFormModal, setShowFormModal] = useState(false);

  const handleProductCreated = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Mis Productos</h1>
        <MiButton 
          variant="primary_1" 
          text="Añadir Producto"
          click={() => setShowFormModal(true)}
        />
      </div>

      <div className={styles.grid}>
        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay productos disponibles</p>
            <MiButton 
              variant="primary" 
              text="Añadir tu primer producto"
              click={() => setShowFormModal(true)}
            />
          </div>
        ) : (
          products.map((product, index) => (
            <Card
              key={product.id || `product-${index}`}
              title={product.name}
              description={product.description}
              image={product.mainImage?.url || 'https://via.placeholder.com/400'}
              price={product.price.toString()}
              stock={product.quantity}
              badges={[product.category]}
              items={[`Marca: ${product.brand}`]}
            >
              <MiButton variant="primary_1" text="Comprar" />
              <MiButton variant="secondary" text="Ver más" />
            </Card>
          ))
        )}
      </div>

      <ProductFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSuccess={handleProductCreated}
      />
    </main>
  );
}