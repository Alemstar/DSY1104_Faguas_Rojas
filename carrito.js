import { PRODUCTS_PS } from './productos_pasteleria.js';

const STORAGE_KEY = 'carrito';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo carrito desde localStorage', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    try { window.dispatchEvent(new Event('updateCartCount')); } catch (e) { }
  } catch (e) {
    console.error('Error guardando carrito en localStorage', e);
  }
}

function _optionsKey(opciones) {
  if (!opciones) return JSON.stringify({});
  const ordered = {};
  Object.keys(opciones).sort().forEach(k => { ordered[k] = opciones[k]; });
  return JSON.stringify(ordered);
}

function _findIndex(cart, code, opciones) {
  const key = _optionsKey(opciones);
  return cart.findIndex(i => i.code === code && _optionsKey(i.opciones) === key);
}

function getCart() {
  return loadCart();
}

function add(item, qty = 1, opciones = {}) {
  if (!item || !item.code) return { success: false, message: 'Item inválido' };
  qty = parseInt(qty, 10) || 0;
  if (qty < 1) return { success: false, message: 'qty debe ser >= 1' };

  const product = PRODUCTS_PS.find(p => p.code === item.code);
  if (!product) return { success: false, message: 'Producto no encontrado' };

  const stock = parseInt(product.stock || 0, 10);
  if (stock <= 0) return { success: false, message: 'Producto sin stock' };

  const cart = loadCart();

  const totalQtyForProduct = cart.filter(c => c.code === item.code).reduce((s, c) => s + (c.qty || 0), 0);

  const existingIndex = _findIndex(cart, item.code, opciones);
  let reservedExcludingThis = totalQtyForProduct;
  if (existingIndex > -1) reservedExcludingThis -= (cart[existingIndex].qty || 0);

  const available = stock - reservedExcludingThis;
  if (available <= 0) return { success: false, message: 'No hay stock disponible para este producto' };

  const toAdd = Math.min(qty, available);

  if (existingIndex > -1) {
    cart[existingIndex].qty = (cart[existingIndex].qty || 0) + toAdd;
    saveCart(cart);
    return { success: true, message: 'Cantidad actualizada', item: cart[existingIndex], added: toAdd };
  }

  const newItem = {
    code: item.code,
    name: item.name || item.nombre || '',
    priceCLP: item.priceCLP || item.precioCLP || 0,
    qty: toAdd,
    opciones: {
      tamano: opciones && opciones.tamano ? opciones.tamano : '',
      mensaje: opciones && opciones.mensaje ? opciones.mensaje : ''
    }
  };

  cart.push(newItem);
  saveCart(cart);
  return { success: true, message: 'Item añadido', item: newItem, added: toAdd };
}

function update(code, qty, opciones = null) {
  qty = parseInt(qty, 10);
  if (isNaN(qty) || qty < 1) return { success: false, message: 'qty debe ser >= 1' };

  const cart = loadCart();
  const idx = opciones !== null ? _findIndex(cart, code, opciones) : cart.findIndex(i => i.code === code);
  if (idx === -1) return { success: false, message: 'Item no encontrado en el carrito' };

  const product = PRODUCTS_PS.find(p => p.code === code);
  if (!product) return { success: false, message: 'Producto no encontrado' };

  const otherQty = cart.reduce((s, ci, i) => (ci.code === code && i !== idx ? s + (ci.qty || 0) : s), 0);
  if (otherQty + qty > (product.stock || 0)) return { success: false, message: 'Stock insuficiente para esta actualización' };

  cart[idx].qty = qty;
  saveCart(cart);
  return { success: true, message: 'Cantidad actualizada', item: cart[idx] };
}

function remove(code, opciones = null) {
  const cart = loadCart();
  const idx = opciones !== null ? _findIndex(cart, code, opciones) : cart.findIndex(i => i.code === code);
  if (idx === -1) return { success: false, message: 'Item no encontrado' };
  const removed = cart.splice(idx, 1)[0];
  saveCart(cart);
  return { success: true, message: 'Item eliminado', item: removed };
}

function clear() {
  saveCart([]);
  return { success: true, message: 'Carrito vacío' };
}

export const Cart = { getCart, add, update, remove, clear };

export default Cart;
