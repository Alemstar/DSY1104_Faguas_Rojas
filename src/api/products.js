// Servicio para obtener productos desde el backend
// Funciona en entornos con process.env (CRA/Vite) o en páginas estáticas usando window.API_BASE_URL
export async function getProducts() {
  const envBase =
    (typeof process !== 'undefined' &&
      process.env &&
      (process.env.REACT_APP_API_BASE_URL || process.env.API_BASE_URL)) ||
    (typeof window !== 'undefined' && window.API_BASE_URL) ||
    'http://localhost:8080';

  const base = String(envBase).replace(/\/$/, '');
  const url = `${base}/products`; // adapta si tu endpoint es /api/products u otro

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error al obtener productos: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}
