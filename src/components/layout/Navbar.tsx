"use client";

import { BsSearchHeart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdOutlineShoppingCart } from "react-icons/md";
import Image from "next/image"; 
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/waggy_logo.png"
          alt="Waggy Pets Logo"
          width={120}
          height={120}
          className={styles.logo}
        />
      </div>

      <div className={styles.searchContainer}>
        <BsSearchHeart className={styles.searchIcon} />
        <input
          className={styles.input}
          type="text"
          placeholder="Encuentra todo para tu mascota..."
        />
      </div>

      <div className={styles.iconGroup}>
        <CgProfile
          className={styles.icon}
          title="Perfil"
          onClick={() => router.push("/login")}
        />
        <MdOutlineShoppingCart
          className={styles.icon}
          title="Carrito"
          onClick={() => router.push("/cart")}
        />
      </div>
    </nav>
  );
}
