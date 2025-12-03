// Servicio para obtener productos desde el backend
// Funciona en entornos con process.env (CRA/Vite) o en páginas estáticas usando window.API_BASE_URL
export async function getProducts() {
  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL)) ||
    (typeof window !== 'undefined' && window.API_BASE_URL) ||
    'http://localhost:8282';

  const base = String(envBase).replace(/\/$/, '');
  const url = `${base}/api/products`; // endpoint: /api/products

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al obtener productos: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  
  // Normalizar los productos para usar 'id' internamente
  return Array.isArray(data) ? data.map(product => ({
    ...product,
    id: product.product_id || product.idProduct || product.id
  })) : data;
}

export async function getProductById(id) {
  if (!id || id === 'undefined') {
    throw new Error('ID de producto no válido');
  }

  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL)) ||
    (typeof window !== 'undefined' && window.API_BASE_URL) ||
    'http://localhost:8282';

  const base = String(envBase).replace(/\/$/, '');
  const url = `${base}/api/products/GetProductById/${id}`; // endpoint: /api/products/GetProductById/:id

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al obtener producto: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  
  // Normalizar el producto para usar 'id' internamente
  return {
    ...data,
    id: data.product_id || data.idProduct || data.id
  };
}
