import { productsApi } from '../../config/axios.config';

/**
 * Obtener todos los productos
 */
export async function getProducts() {
  try {
    const response = await productsApi.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw handleProductError(error);
  }
}

/**
 * Obtener producto por ID
 */
export async function getProductById(productId) {
  try {
    const response = await productsApi.get(`/api/products/GetProductById/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error al obtener producto por ID:', error);
    throw handleProductError(error);
  }
}

/**
 * Crear producto
 */
export async function createProduct(productData) {
  try {
    const response = await productsApi.post('/api/products/insertProduct', productData);
    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw handleProductError(error);
  }
}

/**
 * Actualizar producto
 */
export async function updateProduct(productData) {
  try {
    const response = await productsApi.put('/api/products/UpdateProduct', productData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw handleProductError(error);
  }
}

/**
 * Eliminar producto
 */
export async function deleteProduct(productId) {
  try {
    const response = await productsApi.delete(`/api/products/DeleteProductById/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw handleProductError(error);
  }
}

/**
 * Manejar errores del servicio de productos
 * @param {Error} error
 * @returns {Error}
 */
const handleProductError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Parámetros inválidos');
      case 404:
        return new Error(data.message || 'Producto no encontrado');
      case 500:
        return new Error('Error del servidor. Intente nuevamente más tarde');
      default:
        return new Error(data.message || 'Error al obtener productos');
    }
  } else if (error.request) {
    return new Error('No se pudo conectar con el servidor de productos');
  } else {
    return new Error(error.message || 'Error desconocido');
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};