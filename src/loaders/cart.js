import { getProductById } from "../api/products.js"
import { getCart } from "../api/cart.js"

export async function cartLoader() {
  try {
    // Obtener carrito (desde backend o localStorage según configuración)
    const cart = await getCart()
    
    if (!cart.items || cart.items.length === 0) {
      return { cartItems: [], total: 0 }
    }

    // Validar y enriquecer cada item con datos actualizados del producto
    const validatedItems = await Promise.all(
      cart.items.map(async (item) => {
        try {
          // Si es un producto personalizado (torta custom), no buscar en la base de datos
          if (item.producto?.id === 'CUSTOM' || item.producto?.code === 'CUSTOM') {
            return item
          }

          // Obtener ID del producto
          const productId = item.producto?.id || item.product_id || item.productId
          
          if (!productId) {
            console.error('Item sin ID de producto:', item)
            return null
          }

          // Obtener datos actualizados del producto
          const producto = await getProductById(productId)
          
          if (producto) {
            // Normalizar estructura del item
            return {
              id: item.id || `${productId}-${item.size}-${Date.now()}`,
              producto: producto,
              size: item.size || 'unidad',
              quantity: item.quantity || 1,
              personalizationMessage: item.personalizationMessage || item.personalization_message || ''
            }
          }
          
          return null
        } catch (error) {
          console.error(`Error al validar producto:`, error)
          return null
        }
      })
    )

    // Filtrar items null (productos que ya no existen)
    const cartItems = validatedItems.filter(item => item !== null)
    
    // Calcular total
    const total = cartItems.reduce((sum, item) => 
      sum + (item.producto.precioCLP * item.quantity), 0
    )

    return { cartItems, total }
  } catch (error) {
    console.error('Error al cargar carrito:', error)
    return { cartItems: [], total: 0 }
  }
}
