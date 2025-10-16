import products from '../../../database/products.js';

// Copia en memoria para simular un backend (evitamos mutar el import directamente)
const inMemory = Array.isArray(products) ? [...products] : [];

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export async function getProducts({ q, category } = {}) {
  await delay();
  let data = [...inMemory];

  if (category) {
    const searchCategory = String(category).toLowerCase();
    data = data.filter((p) => String(p.categoriaId || '').toLowerCase() === searchCategory);
  }

  if (q) {
    const term = String(q).toLowerCase();
    data = data.filter((p) =>
      [p.nombre, p.descripcion, p.categoriaId, p.code]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }

  return data;
}

export async function getProductById(code) {
  await delay();
  // Usar los productos actuales directamente desde la base de datos
  const current = Array.isArray(products) ? [...products] : [];
  const searchCode = String(code);
  return current.find((p) => String(p.code) === searchCode) ?? null;
}

export default {
  getProducts,
  getProductById,
};