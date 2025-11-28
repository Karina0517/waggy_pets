// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { connectDB } from "@/app/lib/dbConnection";
import Product, {
  createProductSchema,
  updateProductSchema,
  formatYupErrors,
} from "@/models/product";
import cloudinary from "@/app/lib/cloudinary";

// ==================== POST - Crear producto ====================
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    try {
      const validated = await createProductSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      const product = await Product.create(validated);
      return NextResponse.json(product, { status: 201 });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return NextResponse.json(
          { error: "Validación fallida", details: formatYupErrors(err) },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

// ==================== GET - Obtener productos ====================
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// ==================== PUT - Actualizar producto ====================
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID del producto requerido" },
        { status: 400 }
      );
    }

    const data = await request.json();

    try {
      const validated = await updateProductSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Opcional: Manejo de reemplazo de imágenes en Cloudinary
      if (validated.images) {
        const existing = await Product.findById(id);
        if (existing) {
          const oldPublicIds = (existing.images || []).map(
            (i: any) => i.publicId
          );
          const newPublicIds = validated.images.map((i: any) => i.publicId);
          const toDelete = oldPublicIds.filter(
            (pid: string) => !newPublicIds.includes(pid)
          );

          // Eliminar imágenes antiguas que ya no están
          if (toDelete.length > 0) {
            await Promise.all(
              toDelete.map((pid: string) => cloudinary.uploader.destroy(pid))
            );
          }
        }
      }

      // Opcional: Actualizar mainImage
      if (validated.mainImage) {
        const existing = await Product.findById(id);
        if (
          existing?.mainImage?.publicId &&
          existing.mainImage.publicId !== validated.mainImage.publicId
        ) {
          await cloudinary.uploader.destroy(existing.mainImage.publicId);
        }
      }

      const product = await Product.findByIdAndUpdate(id, validated, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return NextResponse.json(
          { error: "Validación fallida", details: formatYupErrors(err) },
          { status: 400 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// ==================== DELETE - Eliminar producto ====================
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID del producto requerido" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Borrar imágenes de Cloudinary
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
    return NextResponse.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}