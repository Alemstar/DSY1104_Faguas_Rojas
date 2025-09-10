import { Cart } from './carrito.js';
import { PRODUCTS_PS } from './productos_pasteleria.js';
import { getProfile, isOver50, isBirthday, validateCoupon } from './validaciones.js';

function formatCLP(n) {
  return '$ ' + Number(n).toLocaleString('es-CL');
}

function createRow(item) {
  const prod = PRODUCTS_PS.find(p => p.code === item.code) || {};

  // Detect mobile view
  if (window.innerWidth <= 480) {
    const card = document.createElement('div');
    card.className = 'cart-item-card';
    // Title
    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = prod.nombre || item.name;
    card.appendChild(title);
    // Details
    const details = document.createElement('div');
    details.className = 'item-details';
    details.innerHTML = `<span><b>Opciones:</b> ${item.opciones?.tamano || '-'}</span>
      <span><b>Cant.:</b> ${item.qty}</span>
      <span><b>Precio:</b> $${formatCLP(item.priceCLP || prod.precioCLP || 0)}</span>`;
    card.appendChild(details);
    // Subtotal
    const price = document.createElement('div');
    price.className = 'item-price';
    price.textContent = `Subtotal: $${formatCLP((item.priceCLP || prod.precioCLP || 0) * (item.qty || 0))}`;
    card.appendChild(price);
    // Eliminar
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.className = 'btn-eliminar';
    removeBtn.addEventListener('click', () => {
      const res = Cart.remove(item.code, item.opciones);
      if (!res.success) alert(res.message || 'Error eliminando');
      refreshPage();
    });
    card.appendChild(removeBtn);
    return card;
  }

  const tr = document.createElement('tr');

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

  // Discounts (UI only)
  const profile = getProfile();
  const breakdownEl = document.getElementById('discount-breakdown');
  let discounts = [];
  // birthday free: if birthday and exists at least one item, mark cheapest unit free (1 qty)
  if (isBirthday(profile) && cart.length) {
    let cheapestUnit = Infinity;
    cart.forEach((it) => { const unit = it.priceCLP || 0; if (unit < cheapestUnit) cheapestUnit = unit; });
    if (cheapestUnit < Infinity) discounts.push({ type: 'birthday', name: 'Torta gratis (cumpleaños)', amount: cheapestUnit });
  }
  // percent discounts: over50 and coupon
  const over50 = isOver50(profile);
  const couponCode = (document.getElementById('coupon') && document.getElementById('coupon').value) || '';
  const coupon = validateCoupon(couponCode);
  const percentCandidates = [];
  if (over50) percentCandidates.push({ type: 'over50', name: 'Descuento mayores de 50 (50%)', percent: 50 });
  if (coupon && coupon.valid && coupon.type === 'percent') percentCandidates.push({ type: 'coupon', name: `Cupón ${coupon.name} (${coupon.percent}%)`, percent: coupon.percent });
  if (percentCandidates.length) {
    const best = percentCandidates.reduce((a,b) => a.percent > b.percent ? a : b);
    const percentAmount = Math.round(sum * (best.percent / 100));
    discounts.push({ type: best.type, name: best.name, amount: percentAmount });
  }

  const totalDiscount = discounts.reduce((s,d) => s + (d.amount || 0), 0);
  const totalAfter = Math.max(0, sum - totalDiscount);
  totalEl.textContent = formatCLP(totalAfter);

  if (breakdownEl) {
    if (!discounts.length) breakdownEl.innerHTML = '<div>No hay descuentos aplicados.</div>';
    else {
      breakdownEl.innerHTML = '<div><strong>Desglose de descuentos:</strong></div>' + discounts.map(d => `<div style="display:flex; justify-content:space-between;"><span>${d.name}</span><span>${formatCLP(d.amount)}</span></div>`).join('') + `<div style="display:flex; justify-content:space-between; border-top:1px dashed var(--border); margin-top:.5rem; padding-top:.5rem;"><strong>Total</strong><strong>${formatCLP(totalAfter)}</strong></div>`;
    }
  }

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
