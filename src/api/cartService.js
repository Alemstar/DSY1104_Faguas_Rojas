// Servicio para comunicarse con el backend de carrito (ms-cart-bff)

/**
 * Obtiene la URL base del API de carrito desde variables de entorno
 * @returns {string} URL base del API
 */
function getCartApiBaseUrl() {
  const envUrl = import.meta.env.VITE_CART_API_URL
  return envUrl || 'http://localhost:8080'
}

/**
 * Obtiene un carrito por su ID
 * @param {number} idCart - ID del carrito a obtener
 * @returns {Promise<Object>} Datos del carrito
 * @throws {Error} Si la petición falla
 */
export async function getCartById(idCart) {
  if (!idCart) {
    throw new Error('idCart es requerido')
  }

  const baseUrl = getCartApiBaseUrl()
  const url = `${baseUrl}/api/cart/${idCart}`

  console.log(`[CartService] GET ${url}`)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Error al obtener carrito: ${response.status} ${response.statusText} ${errorText}`)
    }

    const data = await response.json()
    console.log('[CartService] Carrito obtenido:', data)
    return data
  } catch (error) {
    console.error('[CartService] Error en getCartById:', error)
    throw error
  }
}

/**
 * Crea un nuevo carrito para un cliente
 * @param {number} idCustomer - ID del cliente
 * @returns {Promise<Object>} Datos del carrito creado
 * @throws {Error} Si la petición falla
 */
export async function createCart(idCustomer) {
  if (!idCustomer) {
    throw new Error('idCustomer es requerido')
  }

  const baseUrl = getCartApiBaseUrl()
  const url = `${baseUrl}/api/cart`

  console.log(`[CartService] POST ${url}`, { idCustomer })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id_customer: idCustomer })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Error al crear carrito: ${response.status} ${response.statusText} ${errorText}`)
    }

    const data = await response.json()
    console.log('[CartService] Carrito creado:', data)
    return data
  } catch (error) {
    console.error('[CartService] Error en createCart:', error)
    throw error
  }
}

/**
 * Agrega un producto al carrito
 * @param {number} idProduct - ID del producto a agregar
 * @param {number} idCart - ID del carrito
 * @returns {Promise<Object>} Datos del carrito actualizado
 * @throws {Error} Si la petición falla
 */
export async function addProductToCart(idProduct, idCart) {
  if (!idProduct) {
    throw new Error('idProduct es requerido')
  }
  if (!idCart) {
    throw new Error('idCart es requerido')
  }

  const baseUrl = getCartApiBaseUrl()
  const url = `${baseUrl}/api/cart/add`

  console.log(`[CartService] POST ${url}`, { idProduct, idCart })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_product: idProduct,
        id_cart: idCart
      })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Error al agregar producto: ${response.status} ${response.statusText} ${errorText}`)
    }

    const data = await response.json()
    console.log('[CartService] Producto agregado:', data)
    return data
  } catch (error) {
    console.error('[CartService] Error en addProductToCart:', error)
    throw error
  }
}

/**
 * Elimina un producto del carrito
 * @param {string} productName - Nombre del producto a eliminar
 * @param {number} idCart - ID del carrito
 * @returns {Promise<Object>} Datos del carrito actualizado
 * @throws {Error} Si la petición falla
 */
export async function removeProductFromCart(productName, idCart) {
  if (!productName) {
    throw new Error('productName es requerido')
  }
  if (!idCart) {
    throw new Error('idCart es requerido')
  }

  const baseUrl = getCartApiBaseUrl()
  const url = `${baseUrl}/api/cart/remove`

  console.log(`[CartService] DELETE ${url}`, { productName, idCart })

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_name: productName,
        id_cart: idCart
      })
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`Error al eliminar producto: ${response.status} ${response.statusText} ${errorText}`)
    }

    const data = await response.json()
    console.log('[CartService] Producto eliminado:', data)
    return data
  } catch (error) {
    console.error('[CartService] Error en removeProductFromCart:', error)
    throw error
  }
}
