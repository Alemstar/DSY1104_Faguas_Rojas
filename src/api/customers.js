// Servicio para autenticación y gestión de clientes
const getApiBase = () => {
  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_CUSTOMERS_API_BASE_URL || process.env.CUSTOMERS_API_BASE_URL)) ||
    (typeof window !== 'undefined' && window.CUSTOMERS_API_BASE_URL) ||
    'http://localhost:8082'; // BFF de customers

  return String(envBase).replace(/\/$/, '');
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - { nombre, apellidos, email, fechaNacimiento, password, codigoPromo? }
 * @returns {Promise<Object>} - Usuario creado
 */
export async function registerUser(userData) {
  const base = getApiBase();
  const url = `${base}/api/auth/register`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(userData)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `Error ${res.status}: ${res.statusText}`;
    throw new Error(errorMessage);
  }

  return await res.json();
}

/**
 * Inicia sesión de un usuario
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - { token?, user, ... }
 */
export async function loginUser(email, password) {
  const base = getApiBase();
  const url = `${base}/api/auth/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.error || `Error ${res.status}: ${res.statusText}`;
    throw new Error(errorMessage);
  }

  return await res.json();
}

/**
 * Obtiene el perfil del usuario autenticado
 * @returns {Promise<Object>} - Datos del usuario
 */
export async function getProfile() {
  const base = getApiBase();
  const url = `${base}/api/customers/profile`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(`Error al obtener perfil: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  const base = getApiBase();
  const url = `${base}/api/customers/logout`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    console.warn('Error al cerrar sesión en el servidor');
  }

  // Limpiar sesión local de todos modos
  localStorage.removeItem('sesionIniciada');
}
