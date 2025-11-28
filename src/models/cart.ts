import mongoose, { Schema, Document, Types } from 'mongoose';
import * as yup from 'yup';


export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId?: string; 
  sessionId: string;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

export const addToCartSchema = yup.object({
  productId: yup.string().required('Product ID es requerido'),
  quantity: yup.number().min(1, 'La cantidad debe ser al menos 1').default(1),
  sessionId: yup.string().required('Session ID es requerido')
});

export const updateCartItemSchema = yup.object({
  quantity: yup.number().min(0, 'La cantidad no puede ser negativa').required('Cantidad es requerida'),
  sessionId: yup.string().required('Session ID es requerido')
});

export const formatYupErrors = (err: yup.ValidationError) => {
  return err.inner.reduce((acc: any, error) => {
    if (error.path) {
      acc[error.path] = error.message;
    }
    return acc;
  }, {});
};

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', cartSchema);
export default Cart;