'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { MiButton } from '../components/ui/button/Button'; 
import styles from './pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalProducts?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalProducts
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.container}>
      {totalProducts && (
        <div className={styles.info}>
          Total: <strong>{totalProducts}</strong> productos
        </div>
      )}

      <div className={styles.pagination}>
        {/* Primera página */}
        <MiButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          ariaLabel="Primera página"
          icon={<ChevronsLeft size={20} />}
        />

        {/* Página anterior */}
        <MiButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          ariaLabel="Página anterior"
          icon={<ChevronLeft size={20} />}
        />

        {/* Números de página */}
        <div className={styles.pages}>
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <MiButton
                key={index}
                // Aquí está la magia: si es la página actual, es 'primary', si no, 'ghost'
                variant={page === currentPage ? 'primary' : 'ghost'} 
                size="sm"
                text={page.toString()}
                onClick={() => onPageChange(page)}
                // Opcional: añadir una clase extra si necesitas ajustar márgenes
                className={styles.pageButton} 
              />
            ) : (
              <span key={index} className={styles.ellipsis}>
                {page}
              </span>
            )
          ))}
        </div>

        {/* Página siguiente */}
        <MiButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          ariaLabel="Página siguiente"
          icon={<ChevronRight size={20} />}
        />

        {/* Última página */}
        <MiButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          ariaLabel="Última página"
          icon={<ChevronsRight size={20} />}
        />
      </div>

      <div className={styles.info}>
        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
      </div>
    </div>
  );
};