"use client";

import { useEmailSender } from "@/hooks/useEmailSender";
import { MiButton } from "../ui/button/Button";
import styles from "./SimpleEmailButton.module.css";

interface EmailResponse {
  message: string;
  [key: string]: unknown;
}

interface SimpleEmailButtonProps {
  to: string;
  subject: string;
  html: string;
  buttonText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  icon?: React.ReactNode;
  onSuccess?: (response: EmailResponse) => void;
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
    
    if (result.success && onSuccess && result.data) {
      onSuccess(result.data);
    } else if (!result.success && onError && result.error) {
      onError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <MiButton
        variant={variant}
        text={loading ? "Enviando..." : buttonText}
        onClick={handleClick}
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
