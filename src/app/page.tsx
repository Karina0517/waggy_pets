import Navbar from '@/components/layout/nav/Navbar';
import { Hero } from '@/components/Hero';
import { ProductSection } from '@/components/product-section/ProductSection';
import { Footer } from '@/components/layout/footer/Footer';
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Cargando...</div>}>
        <Hero />
        <ProductSection />
    </Suspense>
      </div>
    </main>
  );
}