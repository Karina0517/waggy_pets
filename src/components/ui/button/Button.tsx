import React from "react";
import styles from "./button.module.css";

interface ButtonProps {
  variant?: "primary" | "primary_1" | "secondary" | "danger" | "info";
  text?: string;
  disabled?: boolean;
  click?: () => void;
  className?: string;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  ariaLabel?: string;
}

export const MiButton = ({
  variant = "primary",
  text,
  disabled = false,
  click,
  className = "",
  icon,
  iconOnly = false,
  ariaLabel,
}: ButtonProps) => {
  const variantClass = styles[variant] || styles.primary;

  // If iconOnly and there's no visible text, ensure an accessible label is provided
  if (iconOnly && !text && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn(
      'MiButton: using `iconOnly` without `text` requires `ariaLabel` for accessibility.'
    );
  }

  const classes = [styles.base, variantClass, disabled ? styles.disabled : "", className];
  if (iconOnly) classes.push(styles.iconOnly);

  return (
    <button
      onClick={click}
      disabled={disabled}
      className={classes.join(" ")}
      aria-label={iconOnly && !text ? ariaLabel : undefined}
      title={iconOnly && !text ? ariaLabel : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {!iconOnly && text}
    </button>
  );
};