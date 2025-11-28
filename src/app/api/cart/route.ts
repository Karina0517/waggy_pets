import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import { connectDB } from "@/app/lib/dbConnection";
import Cart, { addToCartSchema, updateCartItemSchema, formatYupErrors,   ICartItem, ICart  } from "@/models/cart";
import Product from "@/models/product";


export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID es requerido" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ sessionId }).populate('items.productId');
    
    if (!cart) {
      // Crear carrito vacío si no existe
      cart = await Cart.create({ sessionId, items: [], total: 0 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    return NextResponse.json(
      { error: "Error al obtener carrito" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    try {
      const validated = await addToCartSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      // Verificar que el producto existe
      const product = await Product.findById(validated.productId);
      if (!product) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }

      // Verificar stock
      if (product.quantity < validated.quantity) {
        return NextResponse.json(
          { error: "Stock insuficiente" },
          { status: 400 }
        );
      }

      // Buscar o crear carrito
      let cart = await Cart.findOne({ sessionId: validated.sessionId });
      
      if (!cart) {
        cart = new Cart({ 
          sessionId: validated.sessionId, 
          items: [],
          total: 0
        });
      }

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cart.items.findIndex(
        (item: ICartItem) => item.productId.toString() === validated.productId
      );

      if (existingItemIndex > -1) {
        // Actualizar cantidad
        const newQuantity = cart.items[existingItemIndex].quantity + validated.quantity;
        
        if (product.quantity < newQuantity) {
          return NextResponse.json(
            { error: "Stock insuficiente para la cantidad solicitada" },
            { status: 400 }
          );
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Agregar nuevo item
        cart.items.push({
          productId: product._id,
          quantity: validated.quantity,
          price: product.price
        });
      }

      await cart.save();
      await cart.populate('items.productId');

      return NextResponse.json(cart, { status: 200 });
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
    console.error("Error al agregar al carrito:", error);
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const data = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID es requerido" },
        { status: 400 }
      );
    }

    try {
      const validated = await updateCartItemSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      const cart = await Cart.findOne({ sessionId: validated.sessionId });
      
      if (!cart) {
        return NextResponse.json(
          { error: "Carrito no encontrado" },
          { status: 404 }
        );
      }

      const itemIndex = cart.items.findIndex(
        (item: ICartItem) => item.productId.toString() === productId
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          { error: "Producto no encontrado en el carrito" },
          { status: 404 }
        );
      }

      if (validated.quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const product = await Product.findById(productId);
        if (product && product.quantity < validated.quantity) {
          return NextResponse.json(
            { error: "Stock insuficiente" },
            { status: 400 }
          );
        }
        
        cart.items[itemIndex].quantity = validated.quantity;
      }

      await cart.save();
      await cart.populate('items.productId');

      return NextResponse.json(cart);
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
    console.error("Error al actualizar carrito:", error);
    return NextResponse.json(
      { error: "Error al actualizar carrito" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const productId = searchParams.get("productId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID es requerido" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return NextResponse.json(
        { error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    if (productId) {
      cart.items = cart.items.filter(
        (item: ICartItem) => item.productId.toString() !== productId
      );
      await cart.save();
      await cart.populate('items.productId');
      return NextResponse.json(cart);
    } else {
      cart.items = [];
      cart.total = 0;
      await cart.save();
      return NextResponse.json({ message: "Carrito vaciado exitosamente", cart });
    }
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return NextResponse.json(
      { error: "Error al eliminar del carrito" },
      { status: 500 }
    );
  }
}