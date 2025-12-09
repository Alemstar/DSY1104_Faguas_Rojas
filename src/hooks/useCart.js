import { useState, useEffect } from 'react';
import { 
  getCartById, 
  createCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem 
} from '../services/cartService';

const CART_STORAGE_KEY = 'cartId';

export const useCart = (idCustomer) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get cart ID from localStorage
  const getStoredCartId = () => {
    return localStorage.getItem(CART_STORAGE_KEY);
  };

  // Helper function to save cart ID to localStorage
  const saveCartId = (cartId) => {
    localStorage.setItem(CART_STORAGE_KEY, cartId);
  };

  // Helper function to clear cart ID from localStorage
  const clearCartId = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  // Load cart on component mount or when idCustomer changes
  const loadCart = async () => {
    if (!idCustomer) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, try to get stored cart ID
      let cartId = getStoredCartId();

      // If we have a stored cart ID, try to fetch it
      if (cartId) {
        try {
          const cartData = await getCartById(cartId);
          
          // Verify the cart belongs to the current customer
          if (cartData && cartData.id_customer === idCustomer) {
            setCart(cartData);
            setLoading(false);
            return;
          } else {
            // Cart doesn't belong to this customer, clear it
            clearCartId();
            cartId = null;
          }
        } catch (err) {
          // Cart not found or error fetching, clear stored ID
          console.error('Error fetching stored cart:', err);
          clearCartId();
          cartId = null;
        }
      }

      // If no valid cart found, create a new one
      if (!cartId) {
        await createCart(idCustomer);
        const newCartData = await getCartById(idCustomer);
        setCart(newCartData);
        saveCartId(idCustomer);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err.message || 'Failed to load cart');
      setLoading(false);
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1) => {
    if (!cart) {
      setError('No cart available');
      return;
    }

    try {
      setLoading(true);
      await addItemToCart(cart.id_cart, productId, quantity);
      await loadCart(); // Reload cart to get updated data
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError(err.message || 'Failed to add item to cart');
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItem = async (productId, quantity) => {
    if (!cart) {
      setError('No cart available');
      return;
    }

    try {
      setLoading(true);
      await updateCartItem(cart.id_cart, productId, quantity);
      await loadCart(); // Reload cart to get updated data
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err.message || 'Failed to update cart item');
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    if (!cart) {
      setError('No cart available');
      return;
    }

    try {
      setLoading(true);
      await removeCartItem(cart.id_cart, productId);
      await loadCart(); // Reload cart to get updated data
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError(err.message || 'Failed to remove cart item');
      setLoading(false);
    }
  };

  // Clear entire cart (removes all items)
  const clearCart = async () => {
    if (!cart || !cart.items) {
      return;
    }

    try {
      setLoading(true);
      // Remove all items from the cart
      for (const item of cart.items) {
        await removeCartItem(cart.id_cart, item.id_product);
      }
      await loadCart(); // Reload cart to get updated data
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message || 'Failed to clear cart');
      setLoading(false);
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    if (!cart || !cart.items) {
      return {
        itemCount: 0,
        subtotal: 0,
        tax: 0,
        total: 0
      };
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + tax;

    return {
      itemCount,
      subtotal,
      tax,
      total
    };
  };

  // Load cart when component mounts or idCustomer changes
  useEffect(() => {
    loadCart();
  }, [idCustomer]);

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCartTotals,
    refreshCart: loadCart
  };
};