import Navbar from "../components/layout/nav/Navbar";
import Footer from "../components/layout/footer/Footer";
import Background from "../components/layout/background/Background";
import { ReactNode } from "react";
import styles from "./layout.module.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Background />
        <Navbar />
        <main className={styles.mainContent}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}