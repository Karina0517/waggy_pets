import React from 'react';
import Image from 'next/image';
import { MiButton } from './ui/button/Button';
import { Badge } from './ui/badge/Badge';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  imageUrl: string;
  isMain?: boolean;
  onSetMain?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  isMain = false,
  onSetMain,
  onDelete,
  showActions = true,
}) => {
  const cardClasses = [
    styles.card,
    isMain ? styles.main : ''
  ].join(' ');

  return (
    <div className={cardClasses}>
      <Image
        src={imageUrl}
        alt="Product image"
        width={200}
        height={200}
        className={styles.image}
      />
      
      {isMain && (
        <div className={styles.badgeContainer}>
          <Badge text="★ Principal" variant='success' />
        </div>
      )}

      {showActions && (
        <div className={styles.actionsOverlay}>
          {!isMain && onSetMain && (
            <MiButton
              variant="success" 
              icon={<StarIcon className="w-4 h-4" />}
              text="Principal"
              onClick={onSetMain} 
              className={styles.actionButton}
              size="sm"
            />
          )}
          
          {onDelete && (
            <MiButton
              variant="danger"
              icon={<TrashIcon className="w-4 h-4" />}
              text="Eliminar"
              onClick={onDelete} 
              className={styles.actionButton}
              size="sm"
            />
          )}
        </div>
      )}
    </div>
  );
};