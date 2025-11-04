import { Suspense } from "react";
import LoginForm from "../../components/ui/login-form";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inicia sesión para continuar</h1>
        </div>
        <Suspense fallback={<div className={styles.loading}>Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}