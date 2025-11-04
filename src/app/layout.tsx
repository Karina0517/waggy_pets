import Navbar from "../components/layout/nav/Navbar";
import Footer from "../components/layout/footer/Footer";
import Background from "../components/layout/background/Background";
import { ReactNode } from "react";
import styles from "./layout.module.css";
import {Providers} from "./providers";
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <Background />
        <Navbar />
        <main className={styles.mainContent}>
        <Providers>
          {children}
        </Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}