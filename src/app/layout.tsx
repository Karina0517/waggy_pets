import Navbar from "../components/layout/nav/Navbar";
import { Footer } from "../components/layout/footer/Footer";
import Background from "../components/layout/background/Background";
import { ReactNode } from "react";
import styles from "./layout.module.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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
        <ToastContainer />
      </body>
    </html>
  );
}