import { getProducts } from '../api/products.js';

export async function productsLoader({ request } = {}) {
  try {
    const url = request ? new URL(request.url) : null;
    const q = url ? url.searchParams.get('q') : undefined;
    const category = url ? url.searchParams.get('category') : undefined;
    const minStr = url ? url.searchParams.get('minPrice') : undefined;
    const maxStr = url ? url.searchParams.get('maxPrice') : undefined;

    const minPrice = minStr !== null && minStr !== undefined && minStr !== '' ? Number(minStr) : undefined;
    const maxPrice = maxStr !== null && maxStr !== undefined && maxStr !== '' ? Number(maxStr) : undefined;

    const data = await getProducts({ q, category });

    // Filtro de rango de precios (si se provee)
    let filtered = Array.isArray(data) ? [...data] : [];
    if (Number.isFinite(minPrice)) {
      filtered = filtered.filter((p) => typeof p.precioCLP === 'number' && p.precioCLP >= minPrice);
    }
    if (Number.isFinite(maxPrice)) {
      filtered = filtered.filter((p) => typeof p.precioCLP === 'number' && p.precioCLP <= maxPrice);
    }

    // Normalizamos al shape esperado por la UI (title/image)
    const normalized = filtered.map((p) => ({
      ...p,
      title: p.title ?? p.nombre,
      image: p.image ?? p.imagen ?? null,
    }));
    return normalized;
  } catch (e) {
    console.error(e);
    return [];
  }
}

