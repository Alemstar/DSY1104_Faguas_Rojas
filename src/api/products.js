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
  
  // Normalizar los productos para el frontend
  const normalized = Array.isArray(data) ? data.map(product => {
    const tamanosDisp = product.tamanos_disponibles || product.tamanosDisponibles;
    const tamanosArray = typeof tamanosDisp === 'string' 
      ? tamanosDisp.split(',').map(t => t.trim()) 
      : tamanosDisp;
    
    return {
      ...product,
      id: product.code || product.product_id || product.id,
      precioCLP: product.precio || product.price || product.precioCLP,
      nombre: product.nombre || product.product_name,
      imagen: product.imagen,
      categoriaId: product.categoria || product.categoria_id || product.categoriaId,
      tipoForma: product.tipo_forma || product.tipoForma,
      tamanosDisponibles: tamanosArray,
      descripcion: product.descripcion || product.description
    };
  }) : data;
  
  return normalized;
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
  // Intentar primero con el endpoint por code, si falla buscar en la lista
  const url = `${base}/api/products/${id}`; // endpoint: /api/products/:code

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    // Si falla, intentar obtener todos y buscar por code
    console.warn(`Endpoint ${url} no encontrado, buscando en la lista completa`);
    const allProducts = await getProducts();
    const found = allProducts.find(p => p.id === id || p.code === id);
    if (!found) {
      throw new Error(`Producto con code ${id} no encontrado`);
    }
    return found;
  }

  const data = await res.json();
  
  // Normalizar el producto para el frontend
  const tamanosDisp = data.tamanos_disponibles || data.tamanosDisponibles;
  const tamanosArray = typeof tamanosDisp === 'string' 
    ? tamanosDisp.split(',').map(t => t.trim()) 
    : tamanosDisp;
  
  return {
    ...data,
    id: data.code || data.product_id || data.id,
    precioCLP: data.precio || data.price || data.precioCLP,
    nombre: data.nombre || data.product_name,
    imagen: data.imagen,
    categoriaId: data.categoria || data.categoria_id || data.categoriaId,
    tipoForma: data.tipo_forma || data.tipoForma,
    tamanosDisponibles: tamanosArray,
    descripcion: data.descripcion || data.description
  };
}
