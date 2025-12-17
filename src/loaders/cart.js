import { getCartByCustomerId } from "../api/cart.js"

export async function cartLoader() {
  try {
    // Obtener usuario logueado
    const session = localStorage.getItem('sesionIniciada')
    
    if (!session) {
      // Usuario no logueado - retornar carrito vacío
      return { 
        cartItems: [], 
        cartId: null, 
        subtotal: 0, 
        discount: 0, 
        total: 0,
        appliedCoupon: null 
      }
    }

    const user = JSON.parse(session)
    const customerId = user.customerId || user.id
    
    if (!customerId) {
      console.warn('No se pudo obtener customerId del usuario')
      return { 
        cartItems: [], 
        cartId: null, 
        subtotal: 0, 
        discount: 0, 
        total: 0,
        appliedCoupon: null 
      }
    }

    // Obtener carrito del backend
    const cart = await getCartByCustomerId(customerId)
    
    if (!cart || !cart.items) {
      return { 
        cartItems: [], 
        cartId: cart?.id_cart || null, 
        subtotal: 0, 
        discount: 0, 
        total: 0,
        appliedCoupon: null 
      }
    }

    // Normalizar items para el formato esperado por el frontend
    const cartItems = cart.items.map(item => ({
      id: item.id,
      producto: {
        id: item.productCode,
        code: item.productCode,
        nombre: item.productName,
        precioCLP: item.price,
        imagen: item.imageUrl
      },
      quantity: item.quantity,
      size: item.size,
      personalizationMessage: item.personalizationMessage
    }))

    return { 
      cartItems,
      cartId: cart.id_cart,
      subtotal: cart.subtotal || 0,
      discount: cart.discount || 0,
      total: cart.total || 0,
      appliedCoupon: cart.appliedCoupon
    }
  } catch (error) {
    console.error('Error al cargar carrito:', error)
    return { 
      cartItems: [], 
      cartId: null, 
      subtotal: 0, 
      discount: 0, 
      total: 0,
      appliedCoupon: null 
    }
  }
}
