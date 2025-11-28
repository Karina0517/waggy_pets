import mongoose, { Schema, Model } from "mongoose";
import * as yup from "yup";

export interface IProduct {
  name: string;
  brand: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  mainImage: {
    url: string;
    publicId: string;
  };
  category: string;
  price: number;
  quantity: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

const cloudinaryUrlRegex = /^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\/.+$/;

export const imageShape = yup.object({
  url: yup
    .string()
    .required("La URL es obligatoria")
    .matches(cloudinaryUrlRegex, "URL no válida de Cloudinary"),
  publicId: yup.string().required("El publicId es obligatorio"),
}).noUnknown(true); 

export const mainImageShape = yup.object({
  url: yup
    .string()
    .required("La URL del mainImage es obligatoria")
    .matches(cloudinaryUrlRegex, "URL no válida de Cloudinary"),
  publicId: yup.string().required("El publicId del mainImage es obligatorio"),
}).noUnknown(true);

export const createProductSchema: yup.ObjectSchema<any> = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("El nombre es obligatorio")
      .min(2, "Mínimo 2 caracteres")
      .max(200, "Máximo 200 caracteres"),
    brand: yup
      .string()
      .trim()
      .required("La marca es obligatoria")
      .max(100, "Máximo 100 caracteres"),
    description: yup
      .string()
      .trim()
      .required("La descripción es obligatoria")
      .min(10, "Mínimo 10 caracteres")
      .max(4000, "Máximo 4000 caracteres"),
    images: yup
      .array()
      .of(imageShape)
      .min(1, "Debes enviar al menos 1 imagen")
      .max(10, "Máximo 10 imágenes")
      .required("images es obligatorio"),
    mainImage: mainImageShape.required("mainImage es obligatorio"),
    category: yup
      .string()
      .trim()
      .required("La categoría es obligatoria")
      .max(120, "Máximo 120 caracteres"),
    price: yup
      .number()
      .required("El precio es obligatorio")
      .min(0, "No puede ser negativo"),
    quantity: yup
      .number()
      .required("La cantidad es obligatoria")
      .min(0, "No puede ser negativa"),
    createdAt: yup.date().nullable().notRequired(),
    updatedAt: yup.date().nullable().notRequired(),
  })
  .noUnknown(true);

export const updateProductSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(200, "Máximo 200 caracteres")
    .notRequired(),
  brand: yup
    .string()
    .trim()
    .max(100, "Máximo 100 caracteres")
    .notRequired(),
  description: yup
    .string()
    .trim()
    .min(10, "Mínimo 10 caracteres")
    .max(4000, "Máximo 4000 caracteres")
    .notRequired(),
  images: yup
    .array()
    .of(imageShape)
    .min(1, "Debes enviar al menos 1 imagen")
    .max(10, "Máximo 10 imágenes")
    .notRequired(),
  mainImage: mainImageShape.notRequired(),
  category: yup
    .string()
    .trim()
    .max(120, "Máximo 120 caracteres")
    .notRequired(),
  price: yup.number().min(0, "No puede ser negativo").notRequired(),
  quantity: yup.number().min(0, "No puede ser negativa").notRequired(),
  createdAt: yup.date().nullable().notRequired(),
  updatedAt: yup.date().nullable().notRequired(),
}).noUnknown(true);

export function formatYupErrors(err: yup.ValidationError) {
  const errors: Record<string, string[]> = {};
  err.inner.forEach((e) => {
    const key = e.path || "_error";
    if (!errors[key]) errors[key] = [];
    errors[key].push(e.message);
  });
  return errors;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    mainImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;