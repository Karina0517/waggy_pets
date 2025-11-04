"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  error?: string;
  message?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data: RegisterResponse = await res.json();

      if (res.ok) {
        setMsg("Usuario registrado correctamente");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMsg(data.error || "Error al registrar");
      }
    } catch (error) {
      setMsg("Error de conexión");
      console.error("Error:", error);
    }
  };

  const handleInputChange = (field: keyof RegisterForm) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
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
            onChange={handleInputChange("name")}
            value={form.name}
            required
          />
          <input
            placeholder="Correo electrónico"
            type="email"
            onChange={handleInputChange("email")}
            value={form.email}
            required
          />
          <input
            placeholder="Contraseña"
            type="password"
            onChange={handleInputChange("password")}
            value={form.password}
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