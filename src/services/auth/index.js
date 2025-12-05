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
    const { email, password } = credentials;
    // Enviamos en el body JSON, no en la URL
    const response = await customersApi.post(ENDPOINTS.AUTH_LOGIN, {
      email,
      password
    });
    
    console.log('Respuesta completa del login:', response.data);
    console.log('Datos extraídos - name:', response.data.name, 'lastName:', response.data.lastName, 'userId:', response.data.userId);
    
    // El endpoint retorna { accessToken, refreshToken, tokenType, expiresIn, email, roles, name, lastName, userId }
    const { accessToken, refreshToken, tokenType, expiresIn, roles, name, lastName, userId: responseUserId } = response.data;

    // Guardamos los tokens JWT reales primero
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    
    // Obtener userId de la respuesta o del token JWT
    let userId = responseUserId;
    
    if (!userId && accessToken) {
      try {
        const payload = accessToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        userId = decodedPayload.userId || decodedPayload.id_customer || decodedPayload.idCustomer;
        console.log('UserId obtenido del token JWT:', userId);
      } catch (e) {
        console.error('Error al decodificar token:', e);
      }
    }
    
    console.log('UserId final:', userId);

    // Guardar datos del usuario directamente desde la respuesta del login
    const userDataToSave = {
      nombre: name || credentials.email.split('@')[0],
      apellidos: lastName || '',
      email: response.data.email || credentials.email,
      userId: userId,
      roles: roles || []
    };
    
    console.log('Guardando datos del usuario:', userDataToSave);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userDataToSave));

    // Disparar evento de storage para actualizar componentes
    window.dispatchEvent(new Event('storage'));

    return { accessToken, refreshToken, tokenType, expiresIn };
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - { nombre, apellidos, email, password, fechaNacimiento, edad, codigoPromo }
 * @returns {Promise} - Respuesta con tokens y datos del usuario
 */
export const register = async (userData) => {
  try {
    // Mapear los datos al formato que espera el backend (RegisterRequest)
    const registerRequest = {
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      email: userData.email,
      password: userData.password,
      fechaNacimiento: userData.fechaNacimiento,
      edad: userData.edad,
      codigoPromo: userData.codigoPromo
    };

    const response = await customersApi.post(ENDPOINTS.AUTH_REGISTER, registerRequest);
    
    // El endpoint de registro también retorna tokens JWT
    const { accessToken, refreshToken, tokenType, expiresIn } = response.data;

    // Guardar los tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

    return { accessToken, refreshToken, tokenType, expiresIn };
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
    // Disparar evento de storage para actualizar componentes
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    clearAuthData();
    window.dispatchEvent(new Event('storage'));
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
      refreshToken: refreshToken,
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
 * Obtener datos del usuario actual desde localStorage o token JWT
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    // Primero intentar obtener desde localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      return JSON.parse(userData);
    }

    // Si no hay datos en localStorage, intentar decodificar el token
    const token = getAccessToken();
    if (!token) {
      console.log('No hay token disponible');
      return null;
    }

    // Decodificar el token JWT para obtener la información del usuario
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    console.log('Datos del token JWT:', decodedPayload);
    
    // El token incluye: sub (email), userId, roles, etc.
    return {
      email: decodedPayload.email || decodedPayload.sub,
      userId: decodedPayload.userId,
      roles: decodedPayload.roles || [],
      nombre: decodedPayload.nombre || 'Nombre Usuario',
      apellidos: decodedPayload.apellidos || ''
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
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