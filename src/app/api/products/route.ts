import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { connectDB } from "@/app/lib/dbConnection";
import Product, {
  createProductSchema,
  updateProductSchema,
  formatYupErrors,
} from "@/models/product";
import cloudinary from "@/app/lib/cloudinary";

// Helper para construir query de filtros
function buildFilterQuery(searchParams: URLSearchParams) {
  const query: any = {};

  // Filtro por búsqueda de texto
  const search = searchParams.get("search");
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filtro por categoría
  const category = searchParams.get("category");
  if (category && category !== "all") {
    query.category = category;
  }

  // Filtro por marca
  const brand = searchParams.get("brand");
  if (brand && brand !== "all") {
    query.brand = { $regex: brand, $options: "i" };
  }

  // Filtro por rango de precio
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Filtro por stock disponible
  const inStock = searchParams.get("inStock");
  if (inStock === "true") {
    query.quantity = { $gt: 0 };
  }

  // Filtro por rating mínimo
  const minRating = searchParams.get("minRating");
  if (minRating) {
    query.rating = { $gte: parseFloat(minRating) };
  }

  return query;
}

// Helper para construir opciones de ordenamiento
function buildSortOptions(searchParams: URLSearchParams) {
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const order = searchParams.get("order") === "asc" ? 1 : -1;

  const sortOptions: any = {};
  
  switch (sortBy) {
    case "price":
      sortOptions.price = order;
      break;
    case "name":
      sortOptions.name = order;
      break;
    case "rating":
      sortOptions.rating = order;
      break;
    case "createdAt":
    default:
      sortOptions.createdAt = order;
      break;
  }

  return sortOptions;
}

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Si hay ID, obtener producto individual
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

    // Paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Construir query de filtros
    const filterQuery = buildFilterQuery(searchParams);

    // Construir opciones de ordenamiento
    const sortOptions = buildSortOptions(searchParams);

    // Ejecutar query con paginación - FIX: Agregar "as any" después de .lean()
    const [products, totalProducts] = await Promise.all([
      Product.find(filterQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean() as any,
      Product.countDocuments(filterQuery),
    ]);

    // Calcular metadata de paginación
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Obtener categorías y marcas únicas para filtros
    const [categories, brands] = await Promise.all([
      Product.distinct("category", filterQuery),
      Product.distinct("brand", filterQuery),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        categories: categories.filter(Boolean),
        brands: brands.filter(Boolean),
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

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

          if (toDelete.length > 0) {
            await Promise.all(
              toDelete.map((pid: string) => cloudinary.uploader.destroy(pid))
            );
          }
        }
      }

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