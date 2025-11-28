'use client';

import { useState } from 'react';
import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <img
            src="/images/waggy_logo.png"
            alt="Waggy Pets Logo"
            className={styles.logo}
          />
        </Link>
      </div>

      <form className={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder={t('common.search') || "Buscar productos..."} // Usar traducción o texto fijo
          className={styles.input}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className={styles.searchIcon} />
      </form>

      <div className={styles.iconGroup}>
        <LanguageSwitcher />
        <Link href="/login" className={styles.iconButton} aria-label="Ir al perfil">
          <User size={20} />
        </Link>
        <Link href="/cart" className={styles.cartButton} aria-label="Ver carrito">
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <span className={styles.cartBadge}>
              {itemCount > 99 ? '99+' : itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}