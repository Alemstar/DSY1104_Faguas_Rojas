import { useState, useEffect } from "react"
import { useLoaderData, useRevalidator } from "react-router-dom"
import CartItem from "../../components/cart/CartItem"
import CartSummary from "../../components/cart/CartSummary"
import EmptyCart from "../../components/cart/EmptyCart"
import { updateItemQuantity, removeItemFromCart, clearCart, applyCoupon } from "../../api/cart"
import "./cart.css"

export default function Cart() {
  // Obtener datos del loader
  const loaderData = useLoaderData()
  const revalidator = useRevalidator()
  
  // Estado del carrito
  const [cartItems, setCartItems] = useState(loaderData.cartItems || [])
  const [cartId, setCartId] = useState(loaderData.cartId)
  const [subtotal, setSubtotal] = useState(loaderData.subtotal || 0)
  const [discount, setDiscount] = useState(loaderData.discount || 0)
  const [total, setTotal] = useState(loaderData.total || 0)
  const [appliedCouponCode, setAppliedCouponCode] = useState(loaderData.appliedCoupon)

  // Actualizar estado cuando cambia el loader data
  useEffect(() => {
    setCartItems(loaderData.cartItems || [])
    setCartId(loaderData.cartId)
    setSubtotal(loaderData.subtotal || 0)
    setDiscount(loaderData.discount || 0)
    setTotal(loaderData.total || 0)
    setAppliedCouponCode(loaderData.appliedCoupon)
  }, [loaderData])

  // Cambiar cantidad de un item
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (!cartId) {
      alert('No se pudo actualizar. Carrito no válido.')
      return
    }

    try {
      await updateItemQuantity(cartId, itemId, newQuantity)
      // Recargar datos del carrito
      revalidator.revalidate()
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
      alert('Error al actualizar cantidad del producto')
    }
  }

  // Eliminar item del carrito
  const handleRemoveItem = async (itemId) => {
    if (!cartId) {
      alert('No se pudo eliminar. Carrito no válido.')
      return
    }

    try {
      await removeItemFromCart(cartId, itemId)
      // Recargar datos del carrito
      revalidator.revalidate()
    } catch (error) {
      console.error('Error al eliminar item:', error)
      alert('Error al eliminar producto del carrito')
    }
  }

  // Aplicar cupón
  const handleApplyCoupon = async (code) => {
    if (!cartId) {
      alert('No se pudo aplicar cupón. Carrito no válido.')
      return
    }

    try {
      await applyCoupon(cartId, code)
      // Recargar datos del carrito
      revalidator.revalidate()
      alert('¡Cupón aplicado correctamente!')
    } catch (error) {
      console.error('Error al aplicar cupón:', error)
      alert(error.message || 'Cupón no válido')
    }
  }

  // Vaciar carrito
  const handleClearCart = async () => {
    if (!cartId) {
      alert('No se pudo vaciar. Carrito no válido.')
      return
    }

    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCart(cartId)
        // Recargar datos del carrito
        revalidator.revalidate()
      } catch (error) {
        console.error('Error al vaciar carrito:', error)
        alert('Error al vaciar el carrito')
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
          appliedCoupon={appliedCouponCode}
          onApplyCoupon={handleApplyCoupon}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
          isEmpty={cartItems.length === 0}
        />
      </div>
    </div>
  )
}
