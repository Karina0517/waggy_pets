import React from 'react';
import styles from './badge.module.css';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'new';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default',
  size = 'sm',
  icon
}) => {
  const classes = [
    styles.base,
    styles[variant],
    styles[size]
  ].join(' ');

  return (
    <span className={classes}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {text}
    </span>
  );
};