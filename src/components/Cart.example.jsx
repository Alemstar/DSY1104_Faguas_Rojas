/**
 * Example Usage of Cart Component with Backend Integration
 * 
 * This example demonstrates how to use the new Cart component
 * that integrates with the ms-cart-bff backend service.
 */

import Cart from './Cart'

/**
 * Example 1: Basic Usage
 * Simply pass the customer ID as a prop
 */
export function BasicCartExample() {
  const customerId = 123 // This would typically come from your auth context
  
  return (
    <div className="cart-page">
      <h1>My Shopping Cart</h1>
      <Cart idCustomer={customerId} />
    </div>
  )
}

/**
 * Example 2: Using the Cart with Authentication
 * Get customer ID from an auth context or state
 */
export function AuthenticatedCartExample() {
  // Assuming you have an auth context that provides user info
  // const { user } = useAuth()
  const user = { id: 456, name: 'John Doe' } // Mock user
  
  if (!user) {
    return <div>Please log in to view your cart</div>
  }
  
  return (
    <div className="cart-page">
      <h1>Welcome, {user.name}!</h1>
      <Cart idCustomer={user.id} />
    </div>
  )
}

/**
 * Example 3: Using the useCart Hook Directly
 * For more control over the cart state and operations
 */
import { useCart } from '../hooks/useCart'

export function CustomCartExample() {
  const customerId = 789
  const { cart, loading, error, addProduct, removeProduct } = useCart(customerId)
  
  const handleAddProduct = async () => {
    const productId = 101 // Example product ID
    await addProduct(productId)
    alert('Product added to cart!')
  }
  
  if (loading) {
    return <div className="loading-spinner">Loading your cart...</div>
  }
  
  if (error) {
    return (
      <div className="error-message">
        <h2>Unable to load cart</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }
  
  return (
    <div className="custom-cart">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button onClick={handleAddProduct}>Add Sample Product</button>
      </div>
      
      <div className="cart-summary">
        <p>Cart ID: {cart?.id_cart}</p>
        <p>Items: {cart?.Products?.length || 0}</p>
        <p>Total: ${cart?.total?.toLocaleString('es-CL') || 0}</p>
      </div>
      
      <div className="cart-products">
        {cart?.Products?.map((product, index) => (
          <div key={index} className="product-item">
            <span>{product}</span>
            <button onClick={() => removeProduct(product)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Example 4: Cart with Product List Integration
 * Adding products from a product list to the cart
 */
export function ProductListWithCartExample() {
  const customerId = 999
  const { addProduct } = useCart(customerId)
  
  const products = [
    { id: 1, name: 'Chocolate Cake', price: 25000 },
    { id: 2, name: 'Vanilla Cupcake', price: 5000 },
    { id: 3, name: 'Strawberry Tart', price: 15000 }
  ]
  
  const handleAddToCart = async (productId) => {
    try {
      await addProduct(productId)
      alert('Product added successfully!')
    } catch (error) {
      alert('Failed to add product: ' + error.message)
    }
  }
  
  return (
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price.toLocaleString('es-CL')}</p>
            <button onClick={() => handleAddToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-section">
        <h2>Your Cart</h2>
        <Cart idCustomer={customerId} />
      </div>
    </div>
  )
}

/**
 * Notes:
 * 
 * 1. The Cart component handles all loading, error, and empty states automatically
 * 2. Cart data is persisted in localStorage for each customer
 * 3. The useCart hook provides more flexibility for custom implementations
 * 4. Make sure VITE_CART_API_URL is configured in your .env file
 * 5. The backend must be running on the configured URL (default: http://localhost:8080)
 */
