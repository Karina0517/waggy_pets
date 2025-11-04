"use client";

import { useEmailSender } from "@/hooks/useEmailSender";
import { MiButton } from "../ui/button/Button";
import styles from "./SimpleEmailButton.module.css";

interface SimpleEmailButtonProps {
  to: string;
  subject: string;
  html: string;
  buttonText?: string;
  variant?: "primary" | "primary_1" | "secondary" | "danger" | "info";
  icon?: React.ReactNode;
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
}

export function SimpleEmailButton({ 
  to, 
  subject, 
  html, 
  buttonText = "Enviar Email",
  variant = "primary",
  icon,
  onSuccess,
  onError,
}: SimpleEmailButtonProps) {
  const { loading, message, error, send } = useEmailSender();

  const handleClick = async () => {
    const result = await send({ to, html, subject });
    
    if (result.success && onSuccess) {
      onSuccess(result.data);
    } else if (!result.success && onError) {
      onError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <MiButton
        variant={variant}
        text={loading ? "Enviando..." : buttonText}
        click={handleClick}
        disabled={loading}
        icon={icon}
      />
      
      {message && (
        <p className={error ? styles.errorMessage : styles.successMessage}>
          {message}
        </p>
      )}
    </div>
  );
}