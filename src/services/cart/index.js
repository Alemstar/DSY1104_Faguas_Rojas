import { cartApi } from '../../config/axios.config';

/**
 * Obtener carrito por ID
 */
export const getCartById = async (cartId) => {
  try {
    const response = await cartApi.get(`/api/Cart/getCartById/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    throw handleCartError(error);
  }
};

/**
 * Crear carrito para un cliente
 */
export const createCart = async (customerId) => {
  try {
    const response = await cartApi.post(`/api/Cart/insertCart/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error al crear carrito:', error);
    throw handleCartError(error);
  }
};

/**
 * Agregar producto al carrito
 */
export const addProductToCart = async (productId, cartId) => {
  try {
    const response = await cartApi.post(`/api/Cart/insertProduct/${productId}/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw handleCartError(error);
  }
};

/**
 * Eliminar producto del carrito
 */
export const removeProductFromCart = async (productName, cartId) => {
  try {
    const response = await cartApi.delete(`/api/Cart/deleteProduct/${productName}/${cartId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    throw handleCartError(error);
  }
};

/**
 * Manejar errores del servicio de carrito
 * @param {Error} error
 * @returns {Error}
 */
const handleCartError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Datos inválidos');
      case 401:
        return new Error('Debe iniciar sesión para acceder al carrito');
      case 404:
        return new Error(data.message || 'Carrito o item no encontrado');
      case 409:
        return new Error(data.message || 'Conflicto al actualizar el carrito');
      case 500:
        return new Error('Error del servidor. Intente nuevamente más tarde');
      default:
        return new Error(data.message || 'Error en el carrito');
    }
  } else if (error.request) {
    return new Error('No se pudo conectar con el servidor del carrito');
  } else {
    return new Error(error.message || 'Error desconocido');
  }
};

export default {
  getCartById,
  createCart,
  addProductToCart,
  removeProductFromCart,
};
