import React from 'react';
import Image from 'next/image';
import { MiButton } from './ui/button/Button';
import { Badge } from './ui/badge/Badge';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { div } from 'framer-motion/client';

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
  showActions = true
}) => {
  return (
    
    <div 
      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
        isMain 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
    >
      <Image
        src={imageUrl}
        alt="Product image"
        width={200}
        height={200}
        className="object-cover w-full h-48"
      />
      
      {isMain && (
        <div className="absolute top-2 left-2">
          <Badge text="★ Principal" color="blue" />
        </div>
      )}

      {showActions && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
          {!isMain && onSetMain && (
            <MiButton
              variant="info"
              icon={<StarIcon className="w-4 h-4" />}
              text="Principal"
              click={onSetMain}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            />
          )}
          
          {onDelete && (
            <MiButton
              variant="danger"
              icon={<TrashIcon className="w-4 h-4" />}
              text="Eliminar"
              click={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            />
          )}
        </div>
      )}
    </div>
  );
};