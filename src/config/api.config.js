// Configuración de las URLs base de los microservicios
// Llamamos directamente a los backends (CORS configurado)
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  PRODUCTS_BFF: 'http://localhost:8282',
  CUSTOMERS_BFF: 'http://localhost:8082',
  CART: 'http://localhost:8182',
};

// Configuración de Axios por defecto
export const AXIOS_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Necesario para CORS con credentials
};

// Endpoints comunes
export const ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/GetProductById/${id}`,
  
  // Customers (Auth)
  AUTH_LOGIN: (username, password) => `/api/customers/authenticate/${username}/${password}`,
  AUTH_REGISTER: '/api/customers',
  AUTH_REFRESH: '/api/auth/refresh',
  
  // Customer Profile
  CUSTOMER_PROFILE: '/api/customers/profile',
  CUSTOMER_BY_ID: (id) => `/api/customers/GetCustomerById/${id}`,
  CUSTOMERS_ALL: '/api/customers',
  CUSTOMER_UPDATE: '/api/customers/UpdateCustomer',
  CUSTOMER_DELETE: (id) => `/api/customers/DeleteCustomerById/${id}`,
  
  // Cart
  CART_GET_BY_ID: (cartId) => `/api/Cart/getCartById/${cartId}`,
  CART_INSERT: (customerId) => `/api/Cart/insertCart/${customerId}`,
  CART_ADD_PRODUCT: (productId, cartId) => `/api/Cart/insertProduct/${productId}/${cartId}`,
  CART_REMOVE_PRODUCT: (productName, cartId) => `/api/Cart/deleteProduct/${productName}/${cartId}`,
};

// Claves para localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};
