import { useState, useCallback } from 'react';
import { 
  getCart, 
  createCart, 
  addProductToCart, 
  removeProductFromCart 
} from '../api/cartService';

const CART_STORAGE_KEY = 'cartId';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get cart ID from localStorage
  // Using customer ID as cart ID based on backend design (one cart per customer)
  const getStoredCartId = (idCustomer) => {
    // Try new format first, then fallback to old format for migration
    return localStorage.getItem(`cart_${idCustomer}`) || localStorage.getItem(CART_STORAGE_KEY);
  };

  // Helper function to save cart ID to localStorage
  const saveCartId = (idCustomer, cartId) => {
    localStorage.setItem(`cart_${idCustomer}`, cartId);
    // Also clean up old format key if it exists
    if (localStorage.getItem(CART_STORAGE_KEY)) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  // Load cart by customer ID
  const loadCart = useCallback(async (idCustomer) => {
    if (!idCustomer) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, try to get stored cart ID
      let cartId = getStoredCartId(idCustomer);

      // If we have a stored cart ID, try to fetch it
      if (cartId) {
        try {
          const cartData = await getCart(cartId);
          
          // Verify the cart belongs to the current customer
          if (cartData && cartData.id_customer === idCustomer) {
            setCart(cartData);
            setLoading(false);
            return;
          } else {
            // Cart doesn't belong to this customer, create a new one
            cartId = null;
          }
        } catch (err) {
          // Cart not found or error fetching, create a new one
          console.error('Error fetching stored cart:', err);
          cartId = null;
        }
      }

      // If no valid cart found, create a new one
      if (!cartId) {
        await createCart(idCustomer);
        // After creating, try to fetch it using the customer ID as cart ID
        // Backend design: one cart per customer, so customer ID = cart ID
        const newCartData = await getCart(idCustomer);
        setCart(newCartData);
        // Store the actual cart ID returned from backend
        saveCartId(idCustomer, newCartData.id_cart || idCustomer);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.message || 'Failed to load cart');
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addItem = useCallback(async (productId) => {
    if (!cart) {
      setError('No cart available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await addProductToCart(productId, cart.id_cart);
      // Reload cart to get updated data
      const updatedCart = await getCart(cart.id_cart);
      setCart(updatedCart);
      setLoading(false);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      setLoading(false);
    }
  }, [cart]);

  // Remove item from cart
  const removeItem = useCallback(async (productName) => {
    if (!cart) {
      setError('No cart available');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await removeProductFromCart(productName, cart.id_cart);
      // Reload cart to get updated data
      const updatedCart = await getCart(cart.id_cart);
      setCart(updatedCart);
      setLoading(false);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError(err.message || 'Failed to remove cart item');
      setLoading(false);
    }
  }, [cart]);

  // Clear entire cart (removes all items)
  const clearCart = useCallback(async () => {
    if (!cart || !cart.Products || cart.Products.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Remove all items from the cart
      for (const productName of cart.Products) {
        await removeProductFromCart(productName, cart.id_cart);
      }
      // Reload cart to get updated data
      const updatedCart = await getCart(cart.id_cart);
      setCart(updatedCart);
      setLoading(false);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Failed to clear cart');
      setLoading(false);
    }
  }, [cart]);

  // Calculate cart totals
  const getCartTotals = useCallback(() => {
    if (!cart || !cart.Products) {
      return {
        itemCount: 0,
        total: 0
      };
    }

    return {
      itemCount: cart.Products.length,
      total: cart.total || 0
    };
  }, [cart]);

  return {
    cart,
    loading,
    error,
    addItem,
    removeItem,
    clearCart,
    getCartTotals,
    loadCart
  };
};