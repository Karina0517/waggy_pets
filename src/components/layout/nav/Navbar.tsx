import { Search, User, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
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
        <Link href="/login" className={styles.iconButton} aria-label="Ir al perfil">
          <User />
        </Link>
        <button className={styles.iconButton} aria-label="Ver carrito">
          <ShoppingCart />
        </button>
      </div>
    </nav>
  );
}