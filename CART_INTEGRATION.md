# Cart Backend Integration Documentation

## Overview
This document describes the integration between the frontend and the ms-cart-bff backend service for managing shopping cart functionality.

## Architecture

### Components Created

1. **Cart Service** (`src/api/cartService.js`)
   - Handles all HTTP communication with the ms-cart-bff backend
   - Provides methods for CRUD operations on carts and products

2. **useCart Hook** (`src/hooks/useCart.js`)
   - Custom React hook for managing cart state
   - Handles initialization, loading, and error states
   - Provides methods to add/remove products

3. **Cart Component** (`src/components/Cart.jsx`)
   - React component for displaying cart information
   - Uses the useCart hook for state management
   - Provides UI for viewing and removing products

4. **Cart Styles** (`src/components/Cart.css`)
   - Responsive styles for the Cart component
   - Includes loading, error, and empty states

## API Service Methods

### `getCartById(idCart)`
Retrieves a cart by its ID.
- **Endpoint**: `GET /api/cart/{idCart}`
- **Returns**: Cart object with structure `{id_cart, id_customer, Products[], total}`

### `createCart(idCustomer)`
Creates a new cart for a customer.
- **Endpoint**: `POST /api/cart`
- **Body**: `{id_customer: number}`
- **Returns**: New cart object

### `addProductToCart(idProduct, idCart)`
Adds a product to an existing cart.
- **Endpoint**: `POST /api/cart/add`
- **Body**: `{id_product: number, id_cart: number}`
- **Returns**: Updated cart object

### `removeProductFromCart(productName, idCart)`
Removes a product from a cart by name.
- **Endpoint**: `DELETE /api/cart/remove`
- **Body**: `{product_name: string, id_cart: number}`
- **Returns**: Updated cart object

## Hook Usage

### useCart(idCustomer)

The `useCart` hook provides a complete cart management solution.

**Parameters:**
- `idCustomer` (number): The customer ID to associate with the cart

**Returns:**
```javascript
{
  cart: Object | null,        // Current cart data
  loading: boolean,           // Loading state
  error: string | null,       // Error message if any
  addProduct: (idProduct) => Promise<void>,
  removeProduct: (productName) => Promise<void>,
  reloadCart: () => Promise<void>
}
```

**Example:**
```javascript
import { useCart } from '../hooks/useCart'

function MyCartPage() {
  const { cart, loading, error, addProduct, removeProduct } = useCart(123)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>Cart ID: {cart.id_cart}</h1>
      <p>Total: ${cart.total}</p>
      {/* ... */}
    </div>
  )
}
```

## Component Usage

### Cart Component

**Props:**
- `idCustomer` (number, required): The customer ID

**Example:**
```javascript
import Cart from '../components/Cart'

function CartPage() {
  const customerId = 123 // Get from auth context or props
  return <Cart idCustomer={customerId} />
}
```

## Data Structure

### Cart Object
```typescript
{
  id_cart: number,
  id_customer: number,
  Products: string[],  // Array of product names
  total: number
}
```

## Configuration

### Environment Variables

Add to your `.env` file:
```
VITE_CART_API_URL=http://localhost:8080
```

The service will use this URL to connect to the ms-cart-bff backend. If not provided, it defaults to `http://localhost:8080`.

## Local Storage

Cart IDs are persisted in localStorage with the key format:
```
cart_{idCustomer}
```

This allows the cart to be retrieved when the user returns to the site.

## Error Handling

All service methods and the hook include comprehensive error handling:
- Network errors are caught and logged
- API errors include status codes and messages
- The hook exposes errors through the `error` state
- The Cart component displays error messages to users

## Testing

All components include comprehensive test coverage:
- `src/api/cartService.test.js` - Service method tests
- `src/hooks/useCart.test.js` - Hook behavior tests
- `src/components/Cart.test.jsx` - Component rendering and interaction tests

Run tests with:
```bash
npm test
```

## Development Workflow

1. **Start the backend**: Ensure ms-cart-bff is running on port 8080
2. **Start the frontend**: `npm run dev`
3. **Test the integration**: Navigate to a page using the Cart component

## Troubleshooting

### Cart not loading
- Check that `VITE_CART_API_URL` is set correctly
- Verify the backend is running and accessible
- Check browser console for errors
- Verify the customer ID is valid

### Products not adding/removing
- Check network tab for failed requests
- Verify product IDs and names are correct
- Check backend logs for errors

### LocalStorage issues
- Clear localStorage: `localStorage.clear()`
- Check browser's localStorage quota
- Verify the cart key format is correct

## Future Enhancements

Potential improvements for future iterations:
1. Add quantity management for products
2. Implement product price details
3. Add cart synchronization across tabs
4. Implement optimistic updates for better UX
5. Add cart expiration handling
6. Implement cart merge for anonymous/logged-in users
