'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { MiButton } from './button/Button';
import styles from './login-form.module.css';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl });
  };

  return (
    <div className={styles.formContainer}>
      {/* Botón de Google */}
      <button
        onClick={handleGoogleSignIn}
        className={styles.googleButton}
        type="button"
      >
        <svg className={styles.googleIcon} viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continuar con Google
      </button>

      <div className={styles.divider}>
        <span>O continúa con email</span>
      </div>

      {/* Formulario de credenciales */}
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
              variant="primary"
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
    </div>
  );
}
