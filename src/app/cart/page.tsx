'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { MiButton } from '@/components/ui/button/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, LockKeyhole } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <ShoppingBag size={64} className={styles.emptyIcon} />
          <h2>Tu carrito está vacío</h2>
          <p>¡Agrega productos para comenzar a comprar!</p>
          <Link href="/">
            <MiButton
              variant="primary"
              text="Ir a comprar"
              icon={<ArrowLeft size={20} />}
              iconPosition="left"
            />
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error al vaciar carrito:', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Seguir comprando</span>
        </Link>
        <h1 className={styles.title}>Mi Carrito</h1>
        <p className={styles.subtitle}>{cart.items.length} productos</p>
      </div>

      <div className={styles.content}>
        <div className={styles.items}>
          {cart.items.map((item: any) => (
            <div key={item.productId._id} className={styles.cartItem}>
              <img
                src={item.productId.mainImage?.url || '/images/placeholder.jpg'}
                alt={item.productId.name}
                className={styles.itemImage}
              />
              
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.productId.name}</h3>
                <p className={styles.itemBrand}>{item.productId.brand}</p>
                <p className={styles.itemPrice}>${item.price.toLocaleString()}</p>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className={styles.quantityBtn}
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                    disabled={item.quantity >= item.productId.quantity}
                    className={styles.quantityBtn}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.productId._id)}
                  className={styles.removeBtn}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className={styles.itemTotal}>
                ${(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          <div className={styles.clearCart}>
            <MiButton
              variant="ghost"
              text="Vaciar carrito"
              icon={<Trash2 size={18} />}
              onClick={handleClearCart}
            />
          </div>
        </div>

        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Resumen de compra</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${cart.total.toLocaleString()}</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Envío:</span>
            <span className={styles.free}>Gratis</span>
          </div>
          
          <div className={styles.summaryDivider}></div>
          
          <div className={styles.summaryTotal}>
            <span>Total:</span>
            <span>${cart.total.toLocaleString()}</span>
          </div>

          <MiButton
            variant="primary"
            text="Proceder al pago"
            fullWidth
            size="lg"
          />

          <p className={styles.secureText}><LockKeyhole size={16} /> Compra segura y protegida</p>
        </div>
      </div>
    </div>
  );
}