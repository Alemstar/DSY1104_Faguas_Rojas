import { getProductById } from "../services/product"

export async function cartLoader() {
  // Obtener carrito del localStorage
  const savedCart = localStorage.getItem('cart')
  
  if (!savedCart) {
    return { cartItems: [] }
  }

  const cart = JSON.parse(savedCart)
  
  // Validar y enriquecer cada item con datos actualizados del producto
  const validatedItems = await Promise.all(
    cart.map(async (item) => {
      try {
        // Si es un producto personalizado (torta custom), no buscar en la base de datos
        if (item.producto.code === 'CUSTOM') {
          return item
        }

        // Obtener datos actualizados del producto
        const producto = await getProductById(item.producto.code)
        
        if (producto) {
          // Retornar item con datos actualizados del producto
          return {
            ...item,
            producto: producto
          }
        }
        
        // Si el producto no existe más, retornar null
        return null
      } catch (error) {
        console.error(`Error al validar producto ${item.producto.code}:`, error)
        // Si hay error de conexión, mantener el item con los datos que tenemos
        return item
      }
    })
  )

  // Filtrar items null (productos que ya no existen)
  const cartItems = validatedItems.filter(item => item !== null)
  
  // Si hubo cambios (productos eliminados), actualizar localStorage
  if (cartItems.length !== cart.length) {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }

  return { cartItems }
}
