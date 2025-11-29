"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MiButton } from "@/components/ui/button/Button";
import { ProductFormModal } from "@/components/ProductFormModal";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useProducts } from "@/hooks/useProducts"; 
import { productService } from "@/services/product";
import Swal from 'sweetalert2';
import styles from "./AdminProductList.module.css";

export const AdminProductList = () => {
  const { products, loading, error, refetch } = useProducts(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Lógica de eliminar con SweetAlert2
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el producto permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await productService.deleteProduct(id);
      
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado correctamente',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      });
      
      refetch ? refetch() : window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error eliminando:", error);
      
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un error al eliminar el producto',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch ? refetch() : window.location.reload();
  };

  if (loading) return <div className={styles.loading}>Cargando panel...</div>;
  if (error) return <div className={styles.error}>Error cargando datos</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
            <h2 className={styles.title}>Gestión de Productos</h2>
            <p className={styles.subtitle}>Administra el inventario</p>
        </div>
        <MiButton 
            text="Nuevo Producto" 
            icon={<PlusIcon className="w-5 h-5" />} 
            onClick={handleCreate} 
            variant="primary"
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className={styles.productCell}>
                  <div className={styles.productInfo}>
                    <div className={styles.imgWrapper}>
                        <Image 
                            src={product.mainImage?.url || "/placeholder.jpg"} 
                            alt={product.name} 
                            width={40} 
                            height={40} 
                            className={styles.thumb}
                        />
                    </div>
                    <div>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productBrand}>{product.brand}</span>
                    </div>
                  </div>
                </td>
                <td>
                    <span className={styles.badge}>{product.category || 'Sin categoría'}</span>
                </td>
                <td className={styles.price}>${product.price}</td>
                <td>
                  <span className={`${styles.stock} ${product.quantity < 5 ? styles.lowStock : ''}`}>
                    {product.quantity} u.
                  </span>
                </td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => handleEdit(product)} 
                    className={styles.iconBtn}
                    title="Editar"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(product._id)} 
                    className={`${styles.iconBtn} ${styles.danger}`}
                    title="Eliminar"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        initialData={editingProduct} 
        isEditing={!!editingProduct}
        onDelete={handleDelete} 
      />
    </div>
  );
}