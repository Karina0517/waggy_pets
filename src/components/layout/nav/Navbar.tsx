'use client'
import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { t } = useLanguage();
  const { itemCount } = useCart();

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <img
          src="/images/waggy_logo.png"
          alt="Waggy Pets Logo"
          className={styles.logo}
        />
      </div>

      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Encuentra todo para tu mascota..."
        />
      </div>

      <div className={styles.iconGroup}>
        <LanguageSwitcher />
        <Link href="/login" className={styles.iconButton} aria-label="Ir al perfil">
          <User />
        </Link>
        <Link href="/cart" className={styles.cartButton} aria-label="Ver carrito">
          <ShoppingCart />
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