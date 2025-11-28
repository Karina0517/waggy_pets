import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  rating?: number;
  category?: string;
  description?: string;
  mainImage?: {
    url: string;
    publicId: string;
  };
  images?: Array<{
    url: string;
    publicId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  filters: FilterOptions | null;
  refetch: () => void;
  setFilters: (filters: ProductFilters) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export const useProducts = (initialFilters?: ProductFilters): UseProductsReturn => {
  const searchParams = useSearchParams();

  const getInitialFiltersFromURL = (): ProductFilters => {
    if (!searchParams) return {};

    return {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 6,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      order: (searchParams.get('order') as any) || 'desc',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
    };
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [availableFilters, setAvailableFilters] = useState<FilterOptions | null>(null);

  const [currentFilters, setCurrentFilters] = useState<ProductFilters>(() => {
    const urlFilters = getInitialFiltersFromURL();
    return { 
      page: 1, 
      limit: 6, 
      sortBy: 'createdAt', 
      order: 'desc',
      ...initialFilters, 
      ...urlFilters 
    };
  });

  useEffect(() => {
    const urlFilters = getInitialFiltersFromURL();
    
    const hasSearchChanged = urlFilters.search !== currentFilters.search;
    const hasCategoryChanged = urlFilters.category !== currentFilters.category;
    
    if (hasSearchChanged || hasCategoryChanged) {
       setCurrentFilters(prev => ({
         ...prev,
         ...urlFilters,
         page: hasSearchChanged ? 1 : (urlFilters.page || prev.page)
       }));
    }
  }, [searchParams]); 

  const buildQueryString = useCallback((filters: ProductFilters) => {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return params.toString();
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryString(currentFilters);
      const response = await fetch(`/api/products?${queryString}`);

      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await response.json();
      
      setProducts(data.products);
      setPagination(data.pagination);
      setAvailableFilters(data.filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, buildQueryString]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setFilters = useCallback((newFilters: ProductFilters) => {
    setCurrentFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1 
    }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      setCurrentFilters(prev => ({
        ...prev,
        page: (prev.page || 1) + 1
      }));
    }
  }, [pagination]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      setCurrentFilters(prev => ({
        ...prev,
        page: Math.max((prev.page || 1) - 1, 1)
      }));
    }
  }, [pagination]);

  const goToPage = useCallback((page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      setCurrentFilters(prev => ({
        ...prev,
        page
      }));
    }
  }, [pagination]);

  return {
    products,
    loading,
    error,
    pagination,
    filters: availableFilters,
    refetch: fetchProducts,
    setFilters,
    nextPage,
    prevPage,
    goToPage
  };
};