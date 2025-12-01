import { useState, useEffect } from 'react';
import { 
  getCart, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart,
  applyCoupon 
} from '../services/cart';
import { isAuthenticated } from '../services/auth';

/**
 * Hook personalizado para manejar el carrito de compras
 * @returns {Object} - Estado y funciones del carrito
 */
export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar carrito al montar el componente
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  // Obtener carrito del servidor
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar carrito:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Agregar item al carrito
  const addItem = async (item) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await addItemToCart(item);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de un item
  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await updateCartItemQuantity(itemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar item del carrito
  const removeItem = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito
  const clear = async () => {
    setLoading(true);
    setError(null);
    try {
      const emptyCart = await clearCart();
      setCart(emptyCart);
      return emptyCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aplicar cupón de descuento
  const applyCouponCode = async (couponCode) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await applyCoupon(couponCode);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calcular total de items
  const getTotalItems = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    applyCouponCode,
    getTotalItems,
    isAuthenticated: isAuthenticated(),
  };
};

export default useCart;
