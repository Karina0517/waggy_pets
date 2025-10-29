"use client";

import Link from "next/link";
import Image from "next/image"; 
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={ `flex items-center justify-between p-4 ${styles.navbar}`} >
      <div className="flex items-center">
        <Image
          src="/images/waggy_logo.png" 
          alt="Logo"
          width={200} 
          height={200}
          className="mt-0 inline-block mr-2"
        />
      </div>
      <ul className="flex gap-6">
        <li><Link href="/">Inicio</Link></li>
        <li><Link href="/authors">Autores</Link></li>
        <li><Link href="/books">Libros</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}
