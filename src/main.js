// Ejemplo de uso en una página HTML moderna (type="module")
import { getProducts } from './api/products.js';

function productItemHtml(p) {
  const name = p.name || p.nombre || p.title || 'Producto';
  const price = p.price !== undefined ? p.price : p.precio !== undefined ? p.precio : '';
  return `<li data-id="${p.id || ''}">\n    <strong>${name}</strong>${price !== '' ? ` — $${price}` : ''}${p.description ? `` : ''}\n  </li>`;
}

async function renderProducts() {
  const list = document.getElementById('products-list');
  if (!list) return console.warn('No existe #products-list en el DOM');
  list.innerHTML = '<li>Cargando...</li>';
  try {
    const products = await getProducts();
    if (!Array.isArray(products) || products.length === 0) {
      list.innerHTML = '<li>No hay productos disponibles</li>';
      return;
    }
    list.innerHTML = products.map(productItemHtml).join('');
  } catch (err) {
    console.error(err);
    list.innerHTML = `<li>Error cargando productos: ${err.message}</li>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
