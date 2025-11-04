import { Badge } from "../badge/Badge";
import styles from "./card.module.css";

interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  badges?: string[];
  icon?: React.ElementType;
  items?: string[];
  children?: React.ReactNode;
  price?: string;
  originalPrice?: string;
  stock?: number;
  rating?: number;
}

export const Card = ({
  title,
  description,
  image,
  badges = [],
  icon: Icon,
  items = [],
  children,
  price,
  originalPrice,
  stock,
  rating,
}: CardProps) => {
  const hasDiscount = originalPrice && originalPrice !== price;
  const isLowStock = stock !== undefined && stock < 10;

  const getStockClass = () => {
    if (stock === undefined) return "";
    if (stock > 10) return styles.stockHigh;
    if (stock > 0) return styles.stockMedium;
    return styles.stockLow;
  };

  const getStockText = () => {
    if (stock === undefined) return "";
    return stock > 0 ? `${stock} disponibles` : "Agotado";
  };

  return (
    <div className={styles.card}>
      {/* Imagen del producto */}
      <div className={styles.imageContainer}>
        {image && (
          <img 
            src={image} 
            alt={title} 
            className={styles.image}
          />
        )}
        
        {/* Badges flotantes */}
        <div className={styles.badgesFloat}>
          {hasDiscount && (
            <Badge 
              text={`-${Math.round(((parseFloat(originalPrice!) - parseFloat(price!)) / parseFloat(originalPrice!)) * 100)}%`} 
            />
          )}
          {isLowStock && (
            <Badge text={`¡Solo ${stock}!`} />
          )}
        </div>

        {/* Rating */}
        {rating !== undefined && (
          <div className={styles.rating}>
            <span className={styles.ratingStar}>★</span>
            <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {/* Categorías/Tags */}
        {badges.length > 0 && (
          <div className={styles.badgesInline}>
            {badges.map((b) => (
              <Badge key={b} text={b} />
            ))}
          </div>
        )}

        {/* Título y descripción */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            {title}
          </h3>
          {description && (
            <p className={styles.description}>
              {description}
            </p>
          )}
        </div>

        {/* Precio */}
        {price && (
          <div className={styles.priceContainer}>
            <span className={styles.price}>
              ${price}
            </span>
            {hasDiscount && (
              <span className={styles.originalPrice}>
                ${originalPrice}
              </span>
            )}
          </div>
        )}

        {/* Stock disponible */}
        {stock !== undefined && (
          <div className={styles.stock}>
            <div className={`${styles.stockDot} ${getStockClass()}`} />
            <span className={styles.stockText}>
              {getStockText()}
            </span>
          </div>
        )}

        {/* Características o items */}
        {items.length > 0 && (
          <ul className={styles.itemsList}>
            {items.slice(0, 3).map((item, idx) => (
              <li key={idx} className={styles.item}>
                <span className={styles.itemBullet}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Botones de acción */}
        {children && (
          <div className={styles.actions}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};