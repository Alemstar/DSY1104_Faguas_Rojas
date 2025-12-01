import { customersApi } from '../../config/axios.config';
import { ENDPOINTS, STORAGE_KEYS } from '../../config/api.config';

/**
 * Servicio de autenticación para manejar login, registro y gestión de tokens JWT
 */

/**
 * Realizar login de usuario
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - Respuesta con tokens y datos del usuario
 */
export const login = async (credentials) => {
  try {
    const response = await customersApi.post(ENDPOINTS.AUTH_LOGIN, credentials);
    const { accessToken, refreshToken, user } = response.data;

    // Guardar tokens y datos del usuario en localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - { name, email, password, ... }
 * @returns {Promise} - Respuesta con tokens y datos del usuario
 */
export const register = async (userData) => {
  try {
    const response = await customersApi.post(ENDPOINTS.AUTH_REGISTER, userData);
    const { accessToken, refreshToken, user } = response.data;

    // Guardar tokens y datos del usuario en localStorage
    if (accessToken && refreshToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Cerrar sesión
 * @returns {Promise}
 */
export const logout = async () => {
  try {
    // El backend no tiene endpoint de logout, solo limpiamos localmente
    clearAuthData();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    clearAuthData();
  }
};

/**
 * Refrescar token de acceso
 * @returns {Promise} - Nuevo token de acceso
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await customersApi.post(ENDPOINTS.AUTH_REFRESH, {
      token: refreshToken,
    });

    const { accessToken } = response.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    return accessToken;
  } catch (error) {
    clearAuthData();
    throw handleAuthError(error);
  }
};

/**
 * Obtener token de acceso actual
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Obtener datos del usuario actual
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Limpiar datos de autenticación del localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Manejar errores de autenticación
 * @param {Error} error
 * @returns {Error}
 */
const handleAuthError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Datos inválidos');
      case 401:
        return new Error(data.message || 'Credenciales inválidas');
      case 403:
        return new Error(data.message || 'Acceso denegado');
      case 409:
        return new Error(data.message || 'El usuario ya existe');
      case 500:
        return new Error('Error del servidor. Intente nuevamente más tarde');
      default:
        return new Error(data.message || 'Error en la autenticación');
    }
  } else if (error.request) {
    return new Error('No se pudo conectar con el servidor');
  } else {
    return new Error(error.message || 'Error desconocido');
  }
};

export default {
  login,
  register,
  logout,
  refreshAccessToken,
  getAccessToken,
  getCurrentUser,
  isAuthenticated,
  clearAuthData,
};
