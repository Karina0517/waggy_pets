import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir a Cloudinary usando upload_stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce-products', // Carpeta en Cloudinary
          resource_type: 'auto',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Limitar tamaño
            { quality: 'auto' }, // Optimización automática
            { fetch_format: 'auto' } // Formato automático (webp si es compatible)
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}