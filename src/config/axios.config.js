import axios from 'axios';
import { API_CONFIG, AXIOS_CONFIG, STORAGE_KEYS } from './api.config';

// Instancia de Axios para Products BFF
export const productsApi = axios.create({
  baseURL: API_CONFIG.PRODUCTS_BFF,
  ...AXIOS_CONFIG,
});

// Instancia de Axios para Customers BFF (con autenticación)
export const customersApi = axios.create({
  baseURL: API_CONFIG.CUSTOMERS_BFF,
  ...AXIOS_CONFIG,
});

// Instancia de Axios para Cart
export const cartApi = axios.create({
  baseURL: API_CONFIG.CART,
  ...AXIOS_CONFIG,
});

// Interceptor para agregar el token JWT a las peticiones de customers y cart
const authInterceptor = (config) => {
  // No agregar token en rutas públicas (login, registro y refresh)
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/customers/authenticate'
  ];
  const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));
  
  // Solo agregar token si NO es una ruta pública
  if (!isPublicRoute) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
};

// Aplicar interceptor de autenticación a customersApi y cartApi
customersApi.interceptors.request.use(authInterceptor);
cartApi.interceptors.request.use(authInterceptor);

// Interceptor para manejar errores de autenticación
const errorInterceptor = async (error) => {
  const originalRequest = error.config;

  // Si el error es 401 (No autorizado) y no hemos intentado refrescar el token
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        // Intentar refrescar el token
        const response = await customersApi.post('/api/auth/refresh', {
          token: refreshToken,
        });

        const { accessToken } = response.data;
        
        // Guardar el nuevo token
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        
        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      }
    } catch (refreshError) {
      // Si falla el refresh, limpiar el storage y redirigir al login
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Redirigir al login
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

// Aplicar interceptor de errores
customersApi.interceptors.response.use(
  (response) => response,
  errorInterceptor
);

cartApi.interceptors.response.use(
  (response) => response,
  errorInterceptor
);

// Interceptor para logging (desarrollo)
if (import.meta.env.DEV) {
  const logInterceptor = (response) => {
    console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  };

  productsApi.interceptors.response.use(logInterceptor);
  customersApi.interceptors.response.use(logInterceptor);
  cartApi.interceptors.response.use(logInterceptor);
}
