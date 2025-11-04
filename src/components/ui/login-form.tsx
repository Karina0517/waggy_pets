'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { MiButton } from './button/Button';
import styles from './login-form.module.css';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <div className={styles.inputWrapper}>
            <AtSymbolIcon className={styles.icon} />
            <input
              className={styles.input}
              id="email"
              type="email"
              name="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="password">
            Contraseña
          </label>
          <div className={styles.inputWrapper}>
            <KeyIcon className={styles.icon} />
            <input
              className={styles.input}
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <div className={styles.buttonWrapper}>
          <MiButton
            variant="primary_1"
            text={isPending ? "Ingresando..." : "Iniciar sesión"}
            disabled={isPending}
          />
        </div>

        {errorMessage && (
          <div className={styles.error}>
            <ExclamationCircleIcon className={styles.errorIcon} />
            <p className={styles.errorText}>{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}