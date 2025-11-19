import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/app/lib/dbConnection';
import Product from '@/models/product';
import cloudinary from '@/app/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const product = await Product.create(data);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const product = await Product.findById(id);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      );
    }
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((img: any) => 
        cloudinary.uploader.destroy(img.publicId)
      );
      await Promise.all(deletePromises);
    }
    
    if (product.mainImage?.publicId) {
      await cloudinary.uploader.destroy(product.mainImage.publicId);
    }
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ 
      message: 'Producto eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}