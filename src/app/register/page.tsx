"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setMsg(" Usuario registrado correctamente");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setMsg(data.error || " Error al registrar");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crea tu cuenta</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            placeholder="Nombre"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Correo electrónico"
            type="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Contraseña"
            type="password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button type="submit" className={styles.button}>
            Registrarse
          </button>
        </form>

        {msg && <p className={styles.message}>{msg}</p>}

        <p className={styles.loginText}>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className={styles.loginLink}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
