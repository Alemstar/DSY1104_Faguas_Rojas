import { useState, useCallback } from 'react';
import { 
  getCart, 
  createCart, 
  addProductToCart, 
  removeProductFromCart 
} from '../api/cartService';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get cart ID from localStorage
  // Backend design: one cart per customer (customer ID = cart ID)
  const getStoredCartId = (idCustomer) => {
    const newKey = `cart_${idCustomer}`;
    const oldKey = 'cartId'; // Legacy key format
    
    // Try new format first
    let cartId = localStorage.getItem(newKey);
    
    // If not found, try old format and migrate
    if (!cartId) {
      const oldCartId = localStorage.getItem(oldKey);
      if (oldCartId) {
        // Migrate to new format
        localStorage.setItem(newKey, oldCartId);
        localStorage.removeItem(oldKey);
        cartId = oldCartId;
      }
    }
    
    return cartId;
  };

  // Helper function to save cart ID to localStorage
  const saveCartId = (idCustomer, cartId) => {
    localStorage.setItem(`cart_${idCustomer}`, cartId);
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
        // createCart returns text response, not cart data, so we need a separate fetch
        await createCart(idCustomer);
        // Fetch the newly created cart using customer ID as cart ID
        // Backend design: one cart per customer, so customer ID = cart ID
        const newCartData = await getCart(idCustomer);
        setCart(newCartData);
        // Store the cart ID for future use
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
      // Remove all items from the cart in parallel for better performance
      // Note: This makes concurrent API calls which may be rate-limited by the backend
      // Consider implementing a batch delete endpoint in the backend for better performance
      await Promise.all(
        cart.Products.map(productName => 
          removeProductFromCart(productName, cart.id_cart)
        )
      );
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