import { Cart } from './carrito.js';
import { PRODUCTS_PS } from './productos_pasteleria.js';

function formatCLP(n) {
  return '$ ' + Number(n).toLocaleString('es-CL');
}

function createRow(item) {
  const tr = document.createElement('tr');

  const prod = PRODUCTS_PS.find(p => p.code === item.code) || {};

  const tdName = document.createElement('td');
  tdName.textContent = item.name || prod.nombre || 'Producto';
  tdName.style = 'padding:.75rem;';

  const tdOptions = document.createElement('td');
  tdOptions.style = 'padding:.75rem; font-size:.95rem; color:var(--text);';
  tdOptions.innerHTML = `${item.opciones && item.opciones.tamano ? `Tamaño: <strong>${item.opciones.tamano}</strong><br/>` : ''}${item.opciones && item.opciones.mensaje ? `Mensaje: <em>${item.opciones.mensaje}</em>` : ''}`;

  const tdQty = document.createElement('td');
  tdQty.style = 'padding:.75rem; text-align:center;';
  const qtyInput = document.createElement('input'); qtyInput.type = 'number'; qtyInput.value = item.qty; qtyInput.min = 1; qtyInput.style = 'width:60px; padding:.25rem;';
  tdQty.appendChild(qtyInput);

  const tdPrice = document.createElement('td');
  tdPrice.style = 'padding:.75rem; text-align:right;';
  tdPrice.textContent = formatCLP(item.priceCLP || prod.precioCLP || 0);

  const tdSubtotal = document.createElement('td');
  tdSubtotal.style = 'padding:.75rem; text-align:right; font-weight:700;';
  tdSubtotal.textContent = formatCLP((item.priceCLP || prod.precioCLP || 0) * (item.qty || 0));

  const tdRemove = document.createElement('td');
  tdRemove.style = 'padding:.75rem; text-align:center;';
  const removeBtn = document.createElement('button'); removeBtn.textContent = 'Eliminar'; removeBtn.className = 'btn-link';
  tdRemove.appendChild(removeBtn);

  tr.appendChild(tdName);
  tr.appendChild(tdOptions);
  tr.appendChild(tdQty);
  tr.appendChild(tdPrice);
  tr.appendChild(tdSubtotal);
  tr.appendChild(tdRemove);

  // events
  qtyInput.addEventListener('change', () => {
    const v = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const res = Cart.update(item.code, v, item.opciones);
    if (!res.success) { alert(res.message || 'Error actualizando'); qtyInput.value = item.qty; }
    refreshPage();
  });
  removeBtn.addEventListener('click', () => {
    const res = Cart.remove(item.code, item.opciones);
    if (!res.success) alert(res.message || 'Error eliminando');
    refreshPage();
  });

  return tr;
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

  // create table
  const table = document.createElement('table');
  table.style = 'width:100%; border-collapse:collapse; background:var(--surface); border:1px solid var(--border);';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr style="border-bottom:1px solid var(--border);"><th style="text-align:left; padding:.75rem;">Producto</th><th style="text-align:left; padding:.75rem;">Opciones</th><th style="padding:.75rem; text-align:center;">Cant.</th><th style="padding:.75rem; text-align:right;">Precio</th><th style="padding:.75rem; text-align:right;">Subtotal</th><th style="padding:.75rem;"></th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  let sum = 0;
  cart.forEach(it => {
    tbody.appendChild(createRow(it));
    sum += (it.priceCLP || 0) * (it.qty || 0);
  });
  table.appendChild(tbody);
  list.appendChild(table);

  totalEl.textContent = formatCLP(sum);
  refreshCount();
}

document.addEventListener('DOMContentLoaded', () => {
  refreshPage();
  document.getElementById('apply-coupon').addEventListener('click', () => { alert('Funcionalidad de cupon no implementada'); });
  document.getElementById('checkout').addEventListener('click', () => { alert('Funcionalidad de pago no implementada'); });
  // clear cart modal wiring
  const clearBtn = document.getElementById('clear-cart');
  const modal = document.getElementById('confirm-modal');
  const modalOk = document.getElementById('confirm-ok');
  const modalCancel = document.getElementById('confirm-cancel');
  function openModal() { modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); modal.querySelector('[role=document]').focus(); }
  function closeModal() { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); }
  if (clearBtn) clearBtn.addEventListener('click', () => openModal());
  if (modalCancel) modalCancel.addEventListener('click', () => closeModal());
  if (modalOk) modalOk.addEventListener('click', () => { Cart.clear(); closeModal(); refreshPage(); });
  // close modal with ESC
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.style.display === 'flex') { closeModal(); } });
});
