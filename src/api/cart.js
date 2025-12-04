// Servicio para manejar el carrito con el backend
// BFF Cart - Puerto: 8182
// MODO: Híbrido (localStorage + backend para demostración)

const USE_BACKEND = false; // Cambiar a true cuando el backend esté listo

const getBaseUrl = () => {
  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_CART_API_URL || process.env.CART_API_URL)) ||
    (typeof window !== 'undefined' && window.CART_API_URL) ||
    'http://localhost:8182';

  return String(envBase).replace(/\/$/, '');
};

/**
 * Obtener el carrito (desde backend o localStorage)
 * @returns {Promise<Object>} - Carrito normalizado
 */
export async function getCart() {
  if (!USE_BACKEND) {
    // Modo localStorage (fallback)
    const savedCart = localStorage.getItem('cart');
    const items = savedCart ? JSON.parse(savedCart) : [];
    const total = items.reduce((sum, item) => sum + (item.producto.precioCLP * item.quantity), 0);
    
    return {
      id: null,
      idCustomer: getOrCreateCustomerId(),
      items: items,
      total: total
    };
  }

  // Modo backend
  const cartId = getCartId();
  if (!cartId) {
    // No hay carrito, crear uno nuevo
    const customerId = getOrCreateCustomerId();
    const newCart = await createCart(customerId);
    saveCartId(newCart.id_cart || newCart.idCart);
    return {
      id: newCart.id_cart || newCart.idCart,
      idCustomer: customerId,
      items: [],
      total: 0
    };
  }

  const base = getBaseUrl();
  const url = `${base}/api/cart/getCartById/${cartId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    // Si el carrito no existe, crear uno nuevo
    if (res.status === 404) {
      localStorage.removeItem('cartId');
      return getCart();
    }
    const text = await res.text().catch(() => '');
    throw new Error(`Error al obtener carrito: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  
  // Normalizar respuesta del backend
  return {
    id: data.id_cart || data.idCart,
    idCustomer: data.id_customer || data.idCustomer,
    items: data.items || data.Products || [],
    total: data.total || 0
  };
}

/**
 * Crear un carrito para un cliente
 * @param {string} idCustomer - ID del cliente
 * @returns {Promise<Object>} - CartDTO
 */
export async function createCart(idCustomer) {
  const base = getBaseUrl();
  const url = `${base}/api/cart/insertCart/${idCustomer}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al crear carrito: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Agregar producto al carrito
 * @param {Object} item - Item con {producto, size, quantity, personalizationMessage}
 * @returns {Promise<Object>} - Carrito actualizado
 */
export async function addToCart(item) {
  if (!USE_BACKEND) {
    // Modo localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Buscar si existe item con mismas características
    const existingIndex = currentCart.findIndex(i => 
      i.producto.id === item.producto.id &&
      i.size === item.size &&
      i.personalizationMessage === item.personalizationMessage
    );

    if (existingIndex !== -1) {
      currentCart[existingIndex].quantity += item.quantity;
    } else {
      currentCart.push({
        id: `${item.producto.id}-${item.size}-${Date.now()}`,
        ...item
      });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    return { items: currentCart };
  }

  // Modo backend
  const cartId = getCartId() || (await createCart(getOrCreateCustomerId())).id_cart;
  
  const base = getBaseUrl();
  const url = `${base}/api/cart/insertProduct/${cartId}`;

  const cartItem = {
    product_id: item.producto.id,
    product_name: item.producto.nombre,
    price: item.producto.precioCLP,
    quantity: item.quantity,
    size: item.size || 'unidad',
    personalization_message: item.personalizationMessage || ''
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(cartItem)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al agregar producto: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Actualizar cantidad de un producto
 * @param {string} itemId - ID del item (frontend) o productId (backend)
 * @param {number} quantity - Nueva cantidad
 * @returns {Promise<Object>} - Carrito actualizado
 */
export async function updateCartItemQuantity(itemId, quantity) {
  if (!USE_BACKEND) {
    // Modo localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = currentCart.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    return { items: updatedCart };
  }

  // Modo backend
  const cartId = getCartId();
  const base = getBaseUrl();
  const url = `${base}/api/cart/updateQuantity/${cartId}/${itemId}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ quantity })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al actualizar cantidad: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Eliminar producto del carrito
 * @param {string} itemId - ID del item (frontend) o productId (backend)
 * @returns {Promise<Object>} - Carrito actualizado
 */
export async function removeFromCart(itemId) {
  if (!USE_BACKEND) {
    // Modo localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = currentCart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    return { items: updatedCart };
  }

  // Modo backend
  const cartId = getCartId();
  const base = getBaseUrl();
  const url = `${base}/api/cart/deleteProduct/${cartId}/${itemId}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al eliminar producto: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Obtener o crear idCustomer para sesión actual
 * Si no existe en localStorage, genera uno nuevo
 */
export function getOrCreateCustomerId() {
  let customerId = localStorage.getItem('customerId');
  
  if (!customerId) {
    // Generar ID temporal único basado en timestamp y random
    customerId = `GUEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('customerId', customerId);
  }
  
  return customerId;
}

/**
 * Obtener o crear idCart para sesión actual
 * Si no existe, retorna null para que se cree uno nuevo
 */
export function getCartId() {
  return localStorage.getItem('cartId');
}

/**
 * Guardar idCart en localStorage
 */
export function saveCartId(cartId) {
  localStorage.setItem('cartId', cartId);
}
