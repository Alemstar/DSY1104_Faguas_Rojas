import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import CartItem from "../../components/cart/CartItem"
import CartSummary from "../../components/cart/CartSummary"
import EmptyCart from "../../components/cart/EmptyCart"
import "./cart.css"

export default function Cart() {
  // Obtener datos del loader
  const { cartItems: initialCartItems } = useLoaderData()
  
  // Estado del carrito
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discount, setDiscount] = useState(0)

  // Actualizar estado cuando cambia el loader data
  useEffect(() => {
    setCartItems(initialCartItems)
  }, [initialCartItems])

  // Escuchar cambios en el carrito desde otras páginas
  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart')
      console.log('Evento cartUpdated recibido, recargando desde localStorage')
      if (updatedCart) {
        setCartItems(JSON.parse(updatedCart))
      } else {
        setCartItems([])
      }
    }

    // Solo escuchar eventos de storage (otras pestañas) y cartUpdated (otras páginas)
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('storage', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('storage', handleCartUpdate)
    }
  }, [])

  // Calcular subtotal
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.producto.precioCLP * item.quantity)
  }, 0)

  // Calcular total
  const total = subtotal - discount

  // Cambiar cantidad de un item
  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const { updateCartItemQuantity } = await import('../../api/cart.js')
      await updateCartItemQuantity(itemId, newQuantity)
      
      // Actualizar estado local
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      alert('Error al actualizar la cantidad. Por favor intenta de nuevo.')
    }
  }

  // Eliminar item del carrito
  const handleRemoveItem = async (itemId) => {
    try {
      const { removeFromCart } = await import('../../api/cart.js')
      await removeFromCart(itemId)
      
      // Actualizar estado local
      const updatedItems = cartItems.filter(item => item.id !== itemId)
      setCartItems(updatedItems)
    } catch (error) {
      console.error('Error al eliminar item:', error)
      alert('Error al eliminar el producto. Por favor intenta de nuevo.')
    }
  }

  // Aplicar cupón
  const handleApplyCoupon = (code) => {
    // Validación simple de cupón (mock)
    if (code === 'FELICESS0') {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      setAppliedCoupon(code)
      alert(`¡Cupón aplicado! Descuento del 10%: $${discountAmount.toLocaleString('es-CL')}`)
    } else {
      alert('Cupón no válido')
    }
  }

  // Vaciar carrito
  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        // Eliminar todos los items uno por uno
        const { removeFromCart } = await import('../../api/cart.js')
        await Promise.all(cartItems.map(item => removeFromCart(item.id)))
        
        setCartItems([])
        setAppliedCoupon(null)
        setDiscount(0)
      } catch (error) {
        console.error('Error al vaciar carrito:', error)
        alert('Error al vaciar el carrito. Por favor intenta de nuevo.')
      }
    }
  }

  // Proceder al pago
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío')
      return
    }
    // Aquí iría la lógica para proceder al pago
    alert(`Procesando pago por: $${total.toLocaleString('es-CL')}`)
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Mi carrito de compras</h1>
      
      <div className="cart-container">
        <div className="cart-items-section">
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))
          )}
        </div>

        <CartSummary
          subtotal={subtotal}
          discount={discount}
          total={total}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          isEmpty={cartItems.length === 0}
        />
      </div>
    </div>
  )
}
