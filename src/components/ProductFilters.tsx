'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { MiButton } from './ui/button/Button';
import styles from './productFilters.module.css';

export interface FilterValues {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt';
  order?: 'asc' | 'desc';
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  availableCategories?: string[];
  availableBrands?: string[];
  currentFilters?: FilterValues;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  availableCategories = [],
  availableBrands = [],
  currentFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterValues>(currentFilters);

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const clearedFilters: FilterValues = {
      sortBy: 'createdAt',
      order: 'desc'
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return !!(
      localFilters.search ||
      localFilters.category ||
      localFilters.brand ||
      localFilters.minPrice ||
      localFilters.maxPrice ||
      localFilters.inStock ||
      localFilters.minRating
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Buscar productos..."
          className={styles.searchInput}
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
        />
        {localFilters.search && (
          <button
            className={styles.clearSearch}
            onClick={() => {
              handleFilterChange('search', '');
              applyFilters();
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        className={`${styles.filterButton} ${hasActiveFilters() ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SlidersHorizontal size={20} />
        Filtros
        {hasActiveFilters() && <span className={styles.filterDot} />}
      </button>

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
          <div className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <h3>Filtros</h3>
              <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.filterContent}>
              {/* Ordenar por */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Ordenar por</label>
                <div className={styles.sortControls}>
                  <select
                    className={styles.select}
                    value={localFilters.sortBy || 'createdAt'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="createdAt">Más reciente</option>
                    <option value="price">Precio</option>
                    <option value="name">Nombre</option>
                    <option value="rating">Calificación</option>
                  </select>
                  <select
                    className={styles.select}
                    value={localFilters.order || 'desc'}
                    onChange={(e) => handleFilterChange('order', e.target.value)}
                  >
                    <option value="desc">Descendente</option>
                    <option value="asc">Ascendente</option>
                  </select>
                </div>
              </div>

              {/* Categoría */}
              {availableCategories.length > 0 && (
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Categoría</label>
                  <select
                    className={styles.select}
                    value={localFilters.category || 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value === 'all' ? undefined : e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Marca */}
              {availableBrands.length > 0 && (
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Marca</label>
                  <select
                    className={styles.select}
                    value={localFilters.brand || 'all'}
                    onChange={(e) => handleFilterChange('brand', e.target.value === 'all' ? undefined : e.target.value)}
                  >
                    <option value="all">Todas las marcas</option>
                    {availableBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Rango de precio */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Precio</label>
                <div className={styles.priceRange}>
                  <input
                    type="number"
                    placeholder="Min"
                    className={styles.priceInput}
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className={styles.priceInput}
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              {/* Rating mínimo */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Calificación mínima</label>
                <div className={styles.ratingOptions}>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      className={`${styles.ratingButton} ${localFilters.minRating === rating ? styles.active : ''}`}
                      onClick={() => handleFilterChange('minRating', localFilters.minRating === rating ? undefined : rating)}
                    >
                      {rating} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock disponible */}
              <div className={styles.filterGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={localFilters.inStock || false}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked || undefined)}
                  />
                  <span>Solo productos en stock</span>
                </label>
              </div>
            </div>

            <div className={styles.filterActions}>
              <MiButton
                variant="ghost"
                text="Limpiar filtros"
                onClick={clearFilters}
                fullWidth
              />
              <MiButton
                variant="primary"
                text="Aplicar filtros"
                onClick={applyFilters}
                fullWidth
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};