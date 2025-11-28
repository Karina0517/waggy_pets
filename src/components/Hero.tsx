'use client'
import React, { useState } from 'react';
import { MiButton } from '../components/ui/button/Button';
import { ArrowRight, Star, Package, Heart, Truck } from 'lucide-react';
import styles from './hero.module.css';
import { ProductFormModal } from '@/components/ProductFormModal';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const [showFormModal, setShowFormModal] = useState(false);
  const { products, loading, error, refetch } = useProducts();

  const stats = [
    { label: t('hero.stats.products'), value: '500+', icon: <Package size={20} /> },
    { label: t('hero.stats.happyDogs'), value: '15K+', icon: <Heart size={20} /> },
    { label: t('hero.stats.rating'), value: '4.9★', icon: <Star size={20} /> },
    { label: t('hero.stats.freeShipping'), value: t('hero.stats.freeShippingValue'), icon: <Truck size={20} /> },
  ];

  const handleProductCreated = async () => {
    await refetch();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{t('common.error')}: {error}</p>
      </div>
    );
  }

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <span className={styles.badge}>🐾 {t('hero.subtitle')}</span>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.description}>{t('hero.description')}</p>
          
          <div className={styles.actions}>
            
            <Link href="/products">
              <MiButton
                variant="primary"
                text={t('hero.buttons.shopAll')}
                icon={<ArrowRight size={20} />}
                iconPosition="right"
                size="lg"
              />
            </Link>

          </div>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.imageContent}>
          <div className={styles.imageWrapper}>
            <img 
              src="/images/perrito_feliz.png" 
              alt={t('hero.imageAlt')}
              className={styles.image}
            />
          </div>
        </div>
        <ProductFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleProductCreated}
        />
      </div>
    </section>
  );
};