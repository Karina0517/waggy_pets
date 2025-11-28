import Navbar from "../components/layout/nav/Navbar";
import { Footer } from "../components/layout/footer/Footer";
import Background from "../components/layout/background/Background";
import { ReactNode } from "react";
import styles from "./layout.module.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <LanguageProvider>
          <Background />
          <Navbar />
          <main className={styles.mainContent}>
            <Providers>
              {children}
            </Providers>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}