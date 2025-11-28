import React from 'react';
import Link from 'next/link';
import { Dog, Bone, Home, Cookie, Heart, ArrowRight } from 'lucide-react';
import styles from './categorySection.module.css';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  itemCount: number;
  href: string;
  image?: string;
}

interface CategorySectionProps {
  title?: string;
  categories?: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  title = "Explora por categoría",
  categories = []
}) => {
  const defaultCategories: Category[] = [
    {
      id: '1',
      name: 'Collares',
      icon: <Dog size={24} />,
      color: '#B7FF48',
      description: 'Collares y correas de diseño',
      itemCount: 120,
      href: '/category/collares',
      image: '/images/category-collars.jpg'
    },
    {
      id: '2',
      name: 'Juguetes',
      icon: <Bone size={24} />,
      color: '#FFB6C1',
      description: 'Diversión sin límites',
      itemCount: 85,
      href: '/category/juguetes',
      image: '/images/category-toys.jpg'
    },
    {
      id: '3',
      name: 'Camas',
      icon: <Home size={24} />,
      color: '#2B7A3A',
      description: 'Descanso y confort',
      itemCount: 45,
      href: '/category/camas',
      image: '/images/category-beds.jpg'
    },
    {
      id: '4',
      name: 'Snacks',
      icon: <Cookie size={24} />,
      color: '#FFA500',
      description: 'Premios deliciosos',
      itemCount: 200,
      href: '/category/snacks',
      image: '/images/category-snacks.jpg'
    }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.pawDecoration}>
          <span>🐾</span>
          <span>🐾</span>
          <span>🐾</span>
        </div>
      </div>

      <div className={styles.grid}>
        {displayCategories.map((category, index) => (
          <Link 
            href={category.href} 
            key={category.id} 
            className={styles.card}
            style={{ 
              animationDelay: `${index * 100}ms`,
              '--hover-color': category.color 
            } as React.CSSProperties}
          >
            <div className={styles.cardContent}>
              <div 
                className={styles.iconWrapper}
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div className={styles.icon} style={{ color: category.color }}>
                  {category.icon}
                </div>
              </div>
              
              <div className={styles.textContent}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.description}>{category.description}</p>
                <div className={styles.footer}>
                  <span className={styles.itemCount}>{category.itemCount} productos</span>
                  <ArrowRight size={16} className={styles.arrow} />
                </div>
              </div>
            </div>

            {category.image && (
              <div 
                className={styles.backgroundImage}
                style={{ backgroundImage: `url(${category.image})` }}
              />
            )}

            <div className={styles.hoverEffect}>
              <Heart className={styles.hoverIcon} />
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.promoCard}>
          <div className={styles.promoContent}>
            <span className={styles.promoBadge}>¡Oferta especial!</span>
            <h3 className={styles.promoTitle}>20% OFF en tu primera compra</h3>
            <p className={styles.promoText}>Usa el código: WAGGY20</p>
          </div>
          <div className={styles.promoGraphic}>
            <span className={styles.promoPaw}>🐕</span>
          </div>
        </div>
      </div>
    </section>
  );
};