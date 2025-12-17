// Servicio para gestión del carrito de compras
const getApiBase = () => {
  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_CART_API_BASE_URL || process.env.CART_API_BASE_URL)) ||
    (typeof window !== 'undefined' && window.CART_API_BASE_URL) ||
    'http://localhost:8182'; // BFF de carrito

  return String(envBase).replace(/\/$/, '');
};

/**
 * Obtiene el carrito del usuario logueado
 * @param {number} customerId - ID del customer
 * @returns {Promise<Object>} - Carrito con items
 */
export async function getCartByCustomerId(customerId) {
  const base = getApiBase();
  const url = `${base}/api/Cart/getByCustomerId/${customerId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    // Si no existe carrito, retornar carrito vacío
    if (res.status === 404) {
      return { items: [], subtotal: 0, discount: 0, total: 0 };
    }
    throw new Error(`Error al obtener carrito: ${res.status}`);
  }

  const data = await res.json();
  return data || { items: [], subtotal: 0, discount: 0, total: 0 };
}

/**
 * Crea un carrito nuevo para un customer
 * @param {number} customerId - ID del customer
 * @returns {Promise<string>} - Mensaje de confirmación
 */
export async function createCart(customerId) {
  const base = getApiBase();
  const url = `${base}/api/Cart/insertCart/${customerId}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Error al crear carrito: ${res.status}`);
  }

  return await res.text();
}

/**
 * Agrega un item al carrito
 * @param {number} idCart - ID del carrito
 * @param {Object} item - { productCode, quantity, size, personalizationMessage }
 * @returns {Promise<Object>} - Carrito actualizado
 */
export async function addItemToCart(idCart, item) {
  const base = getApiBase();
  const url = `${base}/api/Cart/addItem/${idCart}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(item)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error al agregar item: ${res.status}`);
  }

  return await res.json();
}

/**
 * Actualiza la cantidad de un item en el carrito
 * @param {number} idCart - ID del carrito
 * @param {string} itemId - ID del item
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} - Carrito actualizado
 */
export async function updateItemQuantity(idCart, itemId, quantity) {
  const base = getApiBase();
  const url = `${base}/api/Cart/updateQuantity/${idCart}/${itemId}/${quantity}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar cantidad: ${res.status}`);
  }

  return await res.json();
}

/**
 * Elimina un item del carrito
 * @param {number} idCart - ID del carrito
 * @param {string} itemId - ID del item a eliminar
 * @returns {Promise<string>} - Mensaje de confirmación
 */
export async function removeItemFromCart(idCart, itemId) {
  const base = getApiBase();
  const url = `${base}/api/Cart/removeItem/${idCart}/${itemId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Error al eliminar item: ${res.status}`);
  }

  return await res.text();
}

/**
 * Vacía completamente el carrito
 * @param {number} idCart - ID del carrito
 * @returns {Promise<string>} - Mensaje de confirmación
 */
export async function clearCart(idCart) {
  const base = getApiBase();
  const url = `${base}/api/Cart/clear/${idCart}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Error al vaciar carrito: ${res.status}`);
  }

  return await res.text();
}

/**
 * Aplica un cupón de descuento al carrito
 * @param {number} idCart - ID del carrito
 * @param {string} couponCode - Código del cupón
 * @returns {Promise<Object>} - Carrito con descuento aplicado
 */
export async function applyCoupon(idCart, couponCode) {
  const base = getApiBase();
  const url = `${base}/api/Cart/applyCoupon/${idCart}/${couponCode}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Cupón inválido');
  }

  return await res.json();
}
