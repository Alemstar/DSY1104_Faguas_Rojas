// Configuración de las URLs base de los microservicios
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
};

// Endpoints comunes
export const ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/GetProductById/${id}`,
  
  // Customers (Auth)
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  
  // Customer Profile
  CUSTOMER_PROFILE: '/api/customers/profile',
  
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
