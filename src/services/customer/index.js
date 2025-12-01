import { customersApi } from '../../config/axios.config';
import { ENDPOINTS } from '../../config/api.config';

/**
 * Obtener perfil del usuario actual
 */
export const getProfile = async () => {
  try {
    const response = await customersApi.get(ENDPOINTS.CUSTOMER_PROFILE);
    return response.data;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Actualizar perfil del usuario actual
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await customersApi.put(ENDPOINTS.CUSTOMER_PROFILE, profileData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Obtener cliente por ID (Admin only)
 */
export const getCustomerById = async (customerId) => {
  try {
    const response = await customersApi.get(`/api/customers/GetCustomerById/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Obtener todos los clientes (Admin only)
 */
export const getAllCustomers = async () => {
  try {
    const response = await customersApi.get('/api/customers');
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Crear nuevo cliente (Admin only)
 */
export const createCustomer = async (customerData) => {
  try {
    const response = await customersApi.post('/api/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Eliminar cliente (Admin only)
 */
export const deleteCustomer = async (customerId) => {
  try {
    const response = await customersApi.delete(`/api/customers/DeleteCustomerById/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Actualizar cliente (Admin only)
 */
export const updateCustomer = async (customerData) => {
  try {
    const response = await customersApi.put('/api/customers/UpdateCustomer', customerData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw handleCustomerError(error);
  }
};

/**
 * Manejar errores del servicio de customers
 * @param {Error} error
 * @returns {Error}
 */
const handleCustomerError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Datos inválidos');
      case 401:
        return new Error('Debe iniciar sesión');
      case 403:
        return new Error('No tiene permisos para realizar esta acción');
      case 404:
        return new Error(data.message || 'Cliente no encontrado');
      case 409:
        return new Error(data.message || 'Conflicto con datos existentes');
      case 500:
        return new Error('Error del servidor. Intente nuevamente más tarde');
      default:
        return new Error(data.message || 'Error al procesar la solicitud');
    }
  } else if (error.request) {
    return new Error('No se pudo conectar con el servidor de clientes');
  } else {
    return new Error(error.message || 'Error desconocido');
  }
};

export default {
  getProfile,
  updateProfile,
  getCustomerById,
  getAllCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
