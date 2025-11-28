'use client';

import { useState } from 'react';
import Image from 'next/image';
import { imageService } from '@/services/product';
import { ImageCard } from '@/components/ImageCard';
import { FileUploader } from '@/components/FileUploader';
import { Badge } from '@/components/ui/badge/Badge';
import type { UploadedImage, ProductImages } from '@/services/product';

interface ProductImageUploaderProps {
  onImagesChange: (data: ProductImages) => void;
  maxImages?: number;
  existingImages?: UploadedImage[];
  existingMainImage?: UploadedImage | null;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  onImagesChange,
  maxImages = 5,
  existingImages = [],
  existingMainImage = null
}) => {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [mainImage, setMainImage] = useState<UploadedImage | null>(existingMainImage);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || images.length >= maxImages) return;

    setUploading(true);

    try {
      const newImages = await imageService.uploadMultipleImages(files);
      const updatedImages = [...images, ...newImages].slice(0, maxImages);
      setImages(updatedImages);

      const updatedMainImage = mainImage || newImages[0];
      setMainImage(updatedMainImage);

      onImagesChange({
        images: updatedImages,
        mainImage: updatedMainImage,
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir imágenes');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = async (publicId: string) => {
    try {
      // Opcional: eliminar de Cloudinary
      // await imageService.deleteImage(publicId);
      
      const updated = images.filter(img => img.publicId !== publicId);
      setImages(updated);

      let updatedMainImage = mainImage;
      if (mainImage?.publicId === publicId) {
        updatedMainImage = updated.length > 0 ? updated[0] : null;
        setMainImage(updatedMainImage);
      }

      onImagesChange({
        images: updated,
        mainImage: updatedMainImage,
      });
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  };

  const setAsMainImage = (image: UploadedImage) => {
    setMainImage(image);
    onImagesChange({
      images,
      mainImage: image,
    });
  };

  return (
    <div className="space-y-6">
      <FileUploader
        onFileChange={handleFileChange}
        disabled={images.length >= maxImages}
        label="Imágenes del producto"
        currentCount={images.length}
        maxCount={maxImages}
        loading={uploading}
      />

      {mainImage && (
        <div className="border-2 border-green-700 rounded-lg p-4 bg-green-50">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            Imagen Principal
            <Badge text="Principal" variant='success' />
          </h3>
          <div className="relative w-full max-w-md mx-auto">
            <Image
              src={mainImage.url}
              alt="Imagen principal"
              width={400}
              height={400}
              className="object-cover rounded-lg w-full"
            />
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Todas las imágenes (Carrusel)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <ImageCard
                key={image.publicId}
                imageUrl={image.url}
                isMain={mainImage?.publicId === image.publicId}
                onSetMain={() => setAsMainImage(image)}
                onDelete={() => removeImage(image.publicId)}
              />
            ))}
          </div>
        </div>
      )}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No hay imágenes cargadas</p>
        </div>
      )}
    </div>
  );
};