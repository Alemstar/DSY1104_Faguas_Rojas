import { useState, useEffect, useCallback } from 'react'
import { getCartById, createCart, addProductToCart, removeProductFromCart } from '../api/cartService'

/**
 * Custom hook para gestionar el carrito de compras con backend
 * @param {number} idCustomer - ID del cliente
 * @returns {Object} Estado y funciones del carrito
 */
export function useCart(idCustomer) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtiene la clave de localStorage para el carrito del cliente
  const getCartStorageKey = useCallback(() => {
    return `cart_${idCustomer}`
  }, [idCustomer])

  // Obtiene el ID del carrito desde localStorage
  const getStoredCartId = useCallback(() => {
    try {
      const stored = localStorage.getItem(getCartStorageKey())
      return stored ? parseInt(stored, 10) : null
    } catch (error) {
      console.error('[useCart] Error al leer localStorage:', error)
      return null
    }
  }, [getCartStorageKey])

  // Guarda el ID del carrito en localStorage
  const saveCartId = useCallback((cartId) => {
    try {
      localStorage.setItem(getCartStorageKey(), cartId.toString())
      console.log('[useCart] ID de carrito guardado en localStorage:', cartId)
    } catch (error) {
      console.error('[useCart] Error al guardar en localStorage:', error)
    }
  }, [getCartStorageKey])

  // Carga el carrito (obtiene existente o crea nuevo)
  const loadCart = useCallback(async () => {
    if (!idCustomer) {
      setError('ID de cliente no proporcionado')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Intentar obtener el ID del carrito almacenado
      const storedCartId = getStoredCartId()

      if (storedCartId) {
        console.log('[useCart] Intentando cargar carrito existente:', storedCartId)
        try {
          const cartData = await getCartById(storedCartId)
          setCart(cartData)
          setLoading(false)
          return
        } catch (error) {
          console.warn('[useCart] No se pudo cargar el carrito existente, creando uno nuevo:', error.message)
          // Si falla, continuamos para crear uno nuevo
        }
      }

      // Si no hay carrito almacenado o falló la carga, crear uno nuevo
      console.log('[useCart] Creando nuevo carrito para cliente:', idCustomer)
      const newCart = await createCart(idCustomer)
      setCart(newCart)
      saveCartId(newCart.id_cart)
      setLoading(false)
    } catch (error) {
      console.error('[useCart] Error al cargar/crear carrito:', error)
      setError(error.message)
      setLoading(false)
    }
  }, [idCustomer, getStoredCartId, saveCartId])

  // Recarga el carrito desde el backend
  const reloadCart = useCallback(async () => {
    if (!cart || !cart.id_cart) {
      console.warn('[useCart] No hay carrito para recargar')
      return
    }

    try {
      console.log('[useCart] Recargando carrito:', cart.id_cart)
      const updatedCart = await getCartById(cart.id_cart)
      setCart(updatedCart)
    } catch (error) {
      console.error('[useCart] Error al recargar carrito:', error)
      setError(error.message)
    }
  }, [cart])

  // Agrega un producto al carrito
  const addProduct = useCallback(async (idProduct) => {
    if (!idProduct) {
      setError('ID de producto no proporcionado')
      return
    }

    if (!cart || !cart.id_cart) {
      setError('No hay carrito disponible')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('[useCart] Agregando producto:', idProduct)
      await addProductToCart(idProduct, cart.id_cart)
      await reloadCart()
    } catch (error) {
      console.error('[useCart] Error al agregar producto:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [cart, reloadCart])

  // Elimina un producto del carrito
  const removeProduct = useCallback(async (productName) => {
    if (!productName) {
      setError('Nombre de producto no proporcionado')
      return
    }

    if (!cart || !cart.id_cart) {
      setError('No hay carrito disponible')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('[useCart] Eliminando producto:', productName)
      await removeProductFromCart(productName, cart.id_cart)
      await reloadCart()
    } catch (error) {
      console.error('[useCart] Error al eliminar producto:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [cart, reloadCart])

  // Cargar el carrito al montar el componente
  useEffect(() => {
    loadCart()
  }, [loadCart])

  return {
    cart,
    loading,
    error,
    addProduct,
    removeProduct,
    reloadCart
  }
}
