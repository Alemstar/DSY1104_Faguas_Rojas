import { Cart } from './carrito.js';
import { PRODUCTS_PS } from './productos_pasteleria.js';

function formatCLP(n) {
  return '$ ' + Number(n).toLocaleString('es-CL');
}

function renderItem(item) {
  const container = document.createElement('div');
  container.className = 'cart-item';
  container.style = 'display:flex; gap:1rem; align-items:center; padding:1rem; border-radius:8px; border:1px solid var(--border); background:#fff;';

  const prod = PRODUCTS_PS.find(p => p.code === item.code) || {};
  const img = document.createElement('img');
  img.src = prod.imagen || 'assets/hero-pasteleria.jpg';
  img.alt = item.name || prod.nombre || '';
  img.style = 'width:110px; height:110px; object-fit:cover; border-radius:8px;';

  const info = document.createElement('div');
  info.style = 'flex:1; display:flex; flex-direction:column; gap:.5rem;';
  const title = document.createElement('div');
  title.textContent = item.name || prod.nombre || 'Producto';
  title.style = 'font-weight:600;';

  const precio = document.createElement('div');
  precio.textContent = formatCLP(item.priceCLP || prod.precioCLP || 0);

  const opciones = document.createElement('div');
  opciones.style = 'font-size:.9rem; color:var(--text);';
  opciones.textContent = item.opciones && item.opciones.tamano ? `Tamaño: ${item.opciones.tamano}` : '';

  const controls = document.createElement('div');
  controls.style = 'display:flex; align-items:center; gap:.5rem;';

  const minus = document.createElement('button'); minus.textContent = '-';
  const qty = document.createElement('input'); qty.type = 'number'; qty.value = item.qty; qty.min = 1; qty.style = 'width:60px; padding:.3rem;';
  const plus = document.createElement('button'); plus.textContent = '+';
  const remove = document.createElement('button'); remove.textContent = 'Eliminar'; remove.style = 'margin-left:1rem; background:transparent; border:none; color:#c62828; cursor:pointer;';

  controls.appendChild(minus);
  controls.appendChild(qty);
  controls.appendChild(plus);
  controls.appendChild(remove);

  info.appendChild(title);
  info.appendChild(opciones);
  info.appendChild(precio);
  info.appendChild(controls);

  container.appendChild(img);
  container.appendChild(info);

  // events
  minus.addEventListener('click', () => {
    const v = Math.max(1, parseInt(qty.value, 10) - 1);
    qty.value = v;
    const res = Cart.update(item.code, v, item.opciones);
    if (!res.success) alert(res.message || 'Error actualizando');
    refreshPage();
  });
  plus.addEventListener('click', () => {
    const v = Math.max(1, parseInt(qty.value, 10) + 1);
    const res = Cart.update(item.code, v, item.opciones);
    if (!res.success) alert(res.message || 'Error actualizando');
    refreshPage();
  });
  qty.addEventListener('change', () => {
    const v = Math.max(1, parseInt(qty.value, 10) || 1);
    const res = Cart.update(item.code, v, item.opciones);
    if (!res.success) { alert(res.message || 'Error actualizando'); qty.value = item.qty; }
    refreshPage();
  });
  remove.addEventListener('click', () => {
    const res = Cart.remove(item.code, item.opciones);
    if (!res.success) alert(res.message || 'Error eliminando');
    refreshPage();
  });

  return container;
}

function refreshCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const cart = Cart.getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 0), 0);
  countEl.textContent = total;
}

function refreshPage() {
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  list.innerHTML = '';
  const cart = Cart.getCart();
  if (!cart.length) {
    list.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalEl.textContent = '$ 0';
    refreshCount();
    return;
  }
  let sum = 0;
  cart.forEach(it => {
    list.appendChild(renderItem(it));
    sum += (it.priceCLP || 0) * (it.qty || 0);
  });
  totalEl.textContent = formatCLP(sum);
  refreshCount();
}

document.addEventListener('DOMContentLoaded', () => {
  refreshPage();
  document.getElementById('apply-coupon').addEventListener('click', () => { alert('Funcionalidad de cupon no implementada'); });
  document.getElementById('checkout').addEventListener('click', () => { alert('Funcionalidad de pago no implementada'); });
});
