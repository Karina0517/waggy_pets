import { useState, useEffect } from 'react';
import { productService } from '@/services/product';
import type { Product, ProductFormData } from '@/services/product';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data: ProductFormData): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.createProduct(data);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      setError('Error al crear producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<ProductFormData>): Promise<Product> => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productService.updateProduct(id, data);
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === id ? updatedProduct : p)
      );
      return updatedProduct;
    } catch (err) {
      setError('Error al actualizar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await productService.deleteProduct(id);
      setProducts(prevProducts => 
        prevProducts.filter(p => p._id !== id)
      );
    } catch (err) {
      setError('Error al eliminar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};