import { useState, useEffect, useCallback } from 'react';

interface CartItem {
  productId: any;
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  sessionId: string;
  items: CartItem[];
  total: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generar o obtener sessionId
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Obtener carrito
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar el carrito');
      }
      
      const data = await response.json();
      setCart(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [getSessionId]);

  // Agregar al carrito
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar al carrito');
      }

      const data = await response.json();
      setCart(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      
      const response = await fetch(`/api/cart?productId=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity,
          sessionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar cantidad');
      }

      const data = await response.json();
      setCart(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error updating quantity:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar del carrito
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      
      const response = await fetch(`/api/cart?sessionId=${sessionId}&productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar del carrito');
      }

      const data = await response.json();
      setCart(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      const sessionId = getSessionId();
      
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al vaciar el carrito');
      }

      const data = await response.json();
      setCart(data.cart);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener cantidad total de items
  const getItemCount = useCallback(() => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Cargar carrito al montar
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    itemCount: getItemCount(),
  };
};