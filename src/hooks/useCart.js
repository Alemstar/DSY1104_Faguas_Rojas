import { useState, useEffect, useCallback } from 'react'
import { getCartById, addItemToCart, updateCartItem, removeItemFromCart, createCart } from '../services/cartService'

const CART_ID_KEY = 'cartId'

// Función para guardar el ID del carrito en localStorage
const saveCartId = (cartId) => {
  localStorage.setItem(CART_ID_KEY, cartId)
}

// Función para obtener el ID del carrito desde localStorage
const getCartId = () => {
  return localStorage.getItem(CART_ID_KEY)
}

// Función para limpiar el ID del carrito de localStorage
const clearCartId = () => {
  localStorage.removeItem(CART_ID_KEY)
}

export const useCart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  // Función para cargar el carrito
  const loadCart = useCallback(async (idCustomer) => {
    try {
      setLoading(true)
      console.log('[useCart] Intentando cargar carrito para cliente:', idCustomer)
      
      // Primero intentar obtener el carrito existente usando idCustomer
      let cartData = null
      try {
        console.log('[useCart] Buscando carrito con ID:', idCustomer)
        cartData = await getCartById(idCustomer)
        console.log('[useCart] Carrito encontrado:', cartData)
      } catch (error) {
        console.log('[useCart] No se encontró carrito existente:', error.message)
      }

      if (cartData && cartData.items) {
        // Si encontramos un carrito válido, usarlo
        console.log('[useCart] Usando carrito existente con', cartData.items.length, 'items')
        setCart(cartData)
        saveCartId(idCustomer)
        setLoading(false)
        return
      }

      // Verificar si hay un cartId almacenado en localStorage diferente
      const storedCartId = getCartId()
      if (storedCartId && storedCartId !== idCustomer) {
        console.log('[useCart] Encontrado cartId diferente en localStorage:', storedCartId)
        try {
          cartData = await getCartById(storedCartId)
          if (cartData && cartData.items) {
            console.log('[useCart] Usando carrito de localStorage con', cartData.items.length, 'items')
            setCart(cartData)
            setLoading(false)
            return
          }
        } catch (error) {
          console.log('[useCart] Carrito de localStorage no válido:', error.message)
          clearCartId()
        }
      }

      // Si no hay carrito almacenado o falló la carga, crear uno nuevo
      console.log('[useCart] Creando nuevo carrito para cliente:', idCustomer)
      await createCart(idCustomer)
      // El backend usa idCart = idCustomer, entonces usamos idCustomer para obtener el carrito
      const newCartData = await getCartById(idCustomer)
      setCart(newCartData)
      saveCartId(idCustomer)
      setLoading(false)

    } catch (error) {
      console.error('[useCart] Error al cargar/crear carrito:', error)
      setCart(null)
      setLoading(false)
    }
  }, [])

  // Función para agregar un producto al carrito
  const addItem = async (productId, quantity = 1) => {
    try {
      if (!cart) {
        throw new Error('No hay carrito disponible')
      }

      console.log('[useCart] Agregando item:', { cartId: cart.idCart, productId, quantity })
      const updatedCart = await addItemToCart(cart.idCart, productId, quantity)
      console.log('[useCart] Carrito actualizado después de agregar:', updatedCart)
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('[useCart] Error al agregar item:', error)
      throw error
    }
  }

  // Función para actualizar la cantidad de un producto
  const updateItem = async (productId, quantity) => {
    try {
      if (!cart) {
        throw new Error('No hay carrito disponible')
      }

      console.log('[useCart] Actualizando item:', { cartId: cart.idCart, productId, quantity })
      const updatedCart = await updateCartItem(cart.idCart, productId, quantity)
      console.log('[useCart] Carrito actualizado después de modificar:', updatedCart)
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('[useCart] Error al actualizar item:', error)
      throw error
    }
  }

  // Función para eliminar un producto del carrito
  const removeItem = async (productId) => {
    try {
      if (!cart) {
        throw new Error('No hay carrito disponible')
      }

      console.log('[useCart] Eliminando item:', { cartId: cart.idCart, productId })
      const updatedCart = await removeItemFromCart(cart.idCart, productId)
      console.log('[useCart] Carrito actualizado después de eliminar:', updatedCart)
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('[useCart] Error al eliminar item:', error)
      throw error
    }
  }

  // Función para limpiar el carrito (útil al cerrar sesión)
  const clearCart = () => {
    console.log('[useCart] Limpiando carrito')
    setCart(null)
    clearCartId()
  }

  // Calcular el total de items en el carrito
  const getTotalItems = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cart,
    loading,
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getTotalItems
  }
}
