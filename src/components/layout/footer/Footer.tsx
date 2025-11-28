'use client'
import React from 'react';
import { MiButton } from '../../ui/button/Button';
import { Facebook, Instagram, Twitter, Youtube, Heart, Mail } from 'lucide-react';
import styles from './Footer.module.css';
import { signOut } from "next-auth/react";
import { useEmailSender } from "@/hooks/useEmailSender";




export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    shop: [
      { label: 'Todos los productos', href: '/products' },
      { label: 'Collares y correas', href: '/category/collars' },
      { label: 'Juguetes', href: '/category/toys' },
      { label: 'Camas y descanso', href: '/category/beds' },
      { label: 'Snacks y premios', href: '/category/snacks' },
    ],
    info: [
      { label: 'Sobre nosotros', href: '/about' },
      { label: 'Preguntas frecuentes', href: '/faq' },
      { label: 'Contacto', href: '/contact' },
      { label: 'Envíos y devoluciones', href: '/shipping' },
      { label: 'Política de privacidad', href: '/privacy' },
    ],
    social: [
      { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
      { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
      { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
      { icon: <Youtube size={20} />, href: '#', label: 'YouTube' },
    ],
  };

    const { loading, message, error, send } = useEmailSender();

    const welcomeEmailHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>¡Bienvenido a Waggy Pets!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header con logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); padding: 40px 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">🐾</div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Waggy Pets</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Felicidad para tu perro</p>
                </td>
              </tr>

              <!-- Contenido principal -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #1a1a1a; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
                    ¡Bienvenido a la manada! 🎉
                  </h2>
                  
                  <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    ¡Guau! Nos emociona tenerte aquí. Tu mejor amigo peludo está a punto de recibir lo mejor en accesorios, juguetes y mimos.
                  </p>

                  <div style="background-color: #f0fdf4; border-left: 4px solid #84cc16; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <h3 style="color: #65a30d; margin: 0 0 15px 0; font-size: 20px;">
                      ✨ ¿Qué recibirás en tu newsletter?
                    </h3>
                    <ul style="color: #4a4a4a; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li><strong>Ofertas exclusivas</strong> para suscriptores</li>
                      <li><strong>Nuevos productos</strong> antes que nadie</li>
                      <li><strong>Tips y consejos</strong> para el cuidado de tu perro</li>
                      <li><strong>Descuentos especiales</strong> en fechas importantes</li>
                      <li><strong>Contenido</strong> sobre bienestar canino</li>
                    </ul>
                  </div>

                  <!-- Imagen decorativa -->
                  <div style="text-align: center; margin: 30px 0;">
                    <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop" 
                         alt="Perro feliz" 
                         style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                  </div>

                  <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    En <strong style="color: #84cc16;">Waggy Pets</strong> creemos que cada perro merece lo mejor. Por eso seleccionamos cuidadosamente cada producto para garantizar la felicidad de tu compañero.
                  </p>

                  <!-- Botón CTA -->
                  <div style="text-align: center; margin: 35px 0;">
                    <a href="https://tudominio.com/products" 
                       style="display: inline-block; background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(132, 204, 22, 0.3);">
                      🛍️ Explorar Productos
                    </a>
                  </div>

                  <p style="color: #4a4a4a; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center; font-style: italic;">
                    💚 ¡Gracias por confiar en nosotros para hacer feliz a tu mejor amigo!
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <div style="margin-bottom: 20px;">
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #84cc16; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" />
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #84cc16; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" />
                    </a>
                    <a href="#" style="display: inline-block; margin: 0 10px; color: #84cc16; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" />
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">
                    <strong>Waggy Pets</strong> - Accesorios de calidad para tu mejor amigo
                  </p>
                  
                  <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                    © ${currentYear} Waggy Pets. Todos los derechos reservados.<br/>
                    <a href="#" style="color: #84cc16; text-decoration: none;">Cancelar suscripción</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  const handleSendEmail = async () => {
    await send({
      to: "henaokarina17@gmail.com",
      html: welcomeEmailHTML,
      subject: "🐾 ¡Bienvenido a Waggy Pets! Tu mejor amigo te lo agradecerá"
    });
  };

  const handleLogout = () => {
    signOut({ 
      callbackUrl: "/login",
      redirect: true
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🐾</span>
              <span className={styles.logoText}>Waggy Pets</span>
            </div>
            <p className={styles.tagline}>Felicidad para tu perro</p>
            <p className={styles.description}>
              Accesorios de calidad que hacen mover la cola. 
              Tu mejor amigo merece lo mejor.
            </p>
            <div className={styles.socialLinks}>
              {footerLinks.social.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={styles.socialLink}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Comprar</h3>
              <ul className={styles.linkList}>
                {footerLinks.shop.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.link}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Información</h3>
              <ul className={styles.linkList}>
                {footerLinks.info.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className={styles.link}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Newsletter</h3>
              <p className={styles.newsletterText}>
                ¡Recibe ofertas y novedades para tu mejor amigo!
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className={styles.newsletterInput}
                  required
                />
              <MiButton
                variant="primary"
                text={loading ? "Enviando..." : "Suscribir"}
                onClick={handleSendEmail}
                disabled={loading}
                icon={<Mail size={18} />}

              />

              </form>
              <p className={styles.newsletterNote}>
                Mucho amor perruno 🐕
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Waggy Pets. Todos los derechos reservados.
          </p>
          <p className={styles.madeWith}>
          </p>
        </div>
      </div>
    </footer>
  );
};