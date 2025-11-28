import React from "react";
import styles from "./button.module.css";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  text?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  loading?: boolean;
}

export const MiButton = ({
  variant = "primary",
  size = "md",
  text,
  disabled = false,
  onClick,
  className = "",
  icon,
  iconPosition = "left",
  fullWidth = false,
  type = "button",
  ariaLabel,
  loading = false,
}: ButtonProps) => {
  const classes = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    disabled || loading ? styles.disabled : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={ariaLabel}
    >
      {loading ? (
        <span className={styles.loader} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className={styles.icon}>{icon}</span>
          )}
          {text && <span>{text}</span>}
          {icon && iconPosition === "right" && (
            <span className={styles.icon}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
};