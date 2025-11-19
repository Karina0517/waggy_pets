import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  name: string;
  brand: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
    width: number;
    height: number;
  }>;
  mainImage: {
    url: string;
    publicId: string;
  };
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
 },
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        width: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
      },
    ],
    mainImage: {
      url: {
        type: String,
        required: false,
      },
      publicId: {
        type: String,
        required: false,
      },
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [0, "La cantidad no puede ser negativa"],
      default: 0,
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;