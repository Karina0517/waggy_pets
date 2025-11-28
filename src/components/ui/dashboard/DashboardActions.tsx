"use client";

import { signOut } from "next-auth/react";
import { useEmailSender } from "@/hooks/useEmailSender";
import { MiButton } from "../button/Button";
import styles from "./DashboardActions.module.css";

export function DashboardActions() {
  const { loading, message, error, send } = useEmailSender();

  const handleSendEmail = async () => {
    await send({
      to: "henaokarina17@gmail.com",
      html: "<h1>¡Hola!</h1><p>Este es un email de prueba desde el dashboard.</p>",
      subject: "Prueba de email desde dashboard"
    });
  };

  const handleLogout = () => {
    signOut({ 
      callbackUrl: "/login",
      redirect: true
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <MiButton
          variant="primary"
          text={loading ? "Enviando..." : "Enviar Email de Prueba"}
          onClick={handleSendEmail}
          disabled={loading}
        />

        <MiButton
          variant="danger"
          text="Cerrar Sesión"
          onClick={handleLogout}
        />
      </div>
      
      {message && (
        <p className={error ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}
    </div>
  );
}
