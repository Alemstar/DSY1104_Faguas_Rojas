import { PRODUCTS_PS } from './productos_pasteleria.js';
import { Cart } from './carrito.js';
function renderDetalle(producto) {
  const container = document.getElementById('detalle-producto-container');
  if (!producto) {
    container.innerHTML = '<p>Producto no encontrado.</p>';
    return;
  }
  const categoria = producto.categoriaId || '';
  const categoriaNombre = categoria;
  const imagenes = [producto.imagen];
  const relacionados = PRODUCTS_PS.filter(p => p.categoriaId === producto.categoriaId && p.code !== producto.code).slice(0,4);

  container.innerHTML = `
    <nav class="breadcrumbs container" style="margin-bottom:1rem;">
      <a href="./">Home</a> &gt; <a href="./productos.html">Productos</a> &gt; ${producto.nombre}
    </nav>
    <div class="detalle-card container" style="display: flex; gap: 2rem; align-items: flex-start;">
      <div class="detalle-gallery" style="flex: 1;">
        <div class="gallery-main">
          <img src="${imagenes[0]}" alt="${producto.nombre}" class="detalle-img" />
        </div>
        <div class="gallery-thumbs" style="display:flex; gap:.5rem; margin-top:.5rem;">
          ${imagenes.map((img, i) => `<img src="${img}" alt="${producto.nombre} miniatura" class="detalle-img" style="width:60px; height:60px; object-fit:cover;${i===0?'border:2px solid var(--primary);':''}" />`).join('')}
        </div>
      </div>
      <div class="detalle-info" style="flex: 1;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">
          <div>
            <h2 style="margin-bottom:.3rem;">${producto.nombre}</h2>
            <div style="display:flex; gap:.5rem;">
              <span class="badge" style="background:${producto.stock > 0 ? '#c8e6c9' : '#ffcdd2'}; color:${producto.stock > 0 ? '#2e7d32' : '#c62828'}; font-weight:600;">${producto.stock > 0 ? 'En stock' : 'Agotado'}</span>
              ${producto.personalizable ? '<span class="badge" style="background:#ffe0f0; color:#ad1457; font-weight:600;">Personalizable</span>' : ''}
            </div>
          </div>
          <span class="price">$${producto.precioCLP}</span>
        </div>
        <p>${producto.descripcion}</p>
        ${producto.stock === 0 ? `<span class="stock-no" style="font-size:1.1rem; font-weight:bold;">Agotado</span>` : `
        <form id="detalle-form" style="margin-bottom:1rem;">
          <div style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap;">
            <label for="tamano" style="font-weight:500;">Tamaño
              <select id="tamano" name="tamano" required style="margin-left:1rem; padding:.3rem .7rem; border-radius:6px;">
                <option value="">Selecciona tamaño</option>
                ${producto.tamanosDisponibles.map(t => `<option value="${t}">${t}</option>`).join('')}
              </select>
            </label>
            <label for="cantidad" style="font-weight:500;">Cantidad
              <input type="number" id="cantidad" name="cantidad" min="1" max="${producto.stock}" value="1" step="1" style="width:70px; margin-left:1rem; padding:.3rem .7rem; border-radius:6px;" required />
            </label>
          </div>
        </form>
        `}
        ${producto.personalizable ? `
          <div class="personaliza-modulo">
            <h3>Personaliza tu producto</h3>
            <label for="mensaje">Mensaje para la torta:</label>
            <input type="text" id="mensaje" name="mensaje" maxlength="${Math.min(producto.maxMsgChars,50)}" placeholder="Escribe tu mensaje aquí..." />
            <div class="mensaje-controls" style="display:flex; gap:.5rem; align-items:center; margin-top:.5rem;">
              <div id="mensaje-preview" class="mensaje-preview" aria-live="polite" style="background:var(--surface); border:1px solid var(--border); padding:.5rem; border-radius:.5rem; min-width:220px; color:var(--text);">&nbsp;</div>
              <div id="mensaje-counter" class="char-counter" style="color:var(--text); font-size:.9rem;">0/${Math.min(producto.maxMsgChars,50)}</div>
            </div>
          </div>
        ` : ''}
  <button class="btn-primary" id="btn-add" ${producto.stock === 0 ? 'disabled' : ''}>Añadir al carrito</button>
  <div id="detalle-feedback" role="status" aria-live="polite" style="margin-top:.5rem; color:var(--text);"></div>
      </div>
    </div>
    <hr />
    <div class="container" style="margin-bottom:3rem;">
      <h3>Productos relacionados</h3>
      <div style="display:flex; gap:2rem; flex-wrap:wrap;">
        ${relacionados.map(p => `
          <a href="detalleProducto.html?codigo=${p.code}" class="card" style="width:180px; min-width:180px; text-align:center; padding:1rem; border-radius:16px; border:1px solid #ddd; background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.7rem;">
            <img src="${p.imagen}" alt="${p.nombre}" style="width:110px; height:110px; object-fit:cover; border-radius:8px; margin:auto;" />
            <span style="font-size:1rem; line-height:1.2;">${p.nombre}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  // --- Attach dynamic behavior after HTML insertion ---
  // Form and add-to-cart behavior (attach immediately)
  if (producto.stock > 0) {
    const form = document.getElementById('detalle-form');
    const btnAdd = document.getElementById('btn-add');
    const feedbackEl = document.getElementById('detalle-feedback');
    if (form && btnAdd) {
      form.addEventListener('submit', function(e) { e.preventDefault(); });
      btnAdd.addEventListener('click', function() {
        const tamanoEl = form.querySelector('#tamano');
        const cantidadEl = form.querySelector('#cantidad');
        const tamano = tamanoEl ? tamanoEl.value : '';
        const cantidad = cantidadEl ? parseInt(cantidadEl.value, 10) : NaN;
        let error = '';
        if (!tamano) error = 'Debes seleccionar un tamaño.';
        if (isNaN(cantidad) || cantidad < 1) error = 'Cantidad debe ser al menos 1.';
        if (cantidad > producto.stock) error = 'No hay suficiente stock.';
        if (error) { if (feedbackEl) { feedbackEl.textContent = error; feedbackEl.style.color = '#c62828'; } else alert(error); return; }
        // Obtener mensaje sanitizado si aplica
        const mensajeInput = document.getElementById('mensaje');
        let mensajeSan = '';
        if (mensajeInput) {
          const raw = mensajeInput.value || '';
          // same sanitization as preview: keep allowed chars and cut to MAX
          const MAX = parseInt(mensajeInput.getAttribute('maxlength') || '50', 10);
          const ALLOWED_RE = /^[A-Za-z0-9 \u00C0-\u017F\.\,\!\¡\¿\?]*$/;
          mensajeSan = raw.split('').filter(ch => ALLOWED_RE.test(ch)).join('').slice(0, MAX);
        }

        // Construir objeto item esperado por Cart
        const item = {
          code: producto.code,
          nombre: producto.nombre,
          precioCLP: producto.precioCLP
        };
        const opciones = { tamano: tamano, mensaje: mensajeSan };

        const res = Cart.add(item, cantidad, opciones);
        if (res && res.success) {
          const added = res.added || cantidad;
          const msg = added < cantidad ? `Se añadieron ${added} (stock limitado) de ${producto.nombre}.` : `Añadido: ${added} x ${producto.nombre} (${tamano})` + (mensajeSan ? ` — Mensaje: ${mensajeSan}` : '');
          if (feedbackEl) { feedbackEl.textContent = msg; feedbackEl.style.color = '#2e7d32'; }
        } else {
          const err = (res && res.message) ? res.message : 'Error añadiendo al carrito';
          if (feedbackEl) { feedbackEl.textContent = err; feedbackEl.style.color = '#c62828'; } else alert(err);
        }
      });
    }
  }

  // Personalización: preview, contador y saneamiento
  (function(){
    const mensajeInput = document.getElementById('mensaje');
    if (!mensajeInput) return;
    const preview = document.getElementById('mensaje-preview');
    const counter = document.getElementById('mensaje-counter');
    const MAX = parseInt(mensajeInput.getAttribute('maxlength') || '50', 10);

  // Permitir solo letras, números, espacios y signos básicos: .,!¡¿? y rango de letras acentuadas
  const ALLOWED_RE = /^[A-Za-z0-9 \u00C0-\u017F\.\,\!\¡\¿\?]*$/;

    function escapeHtml(str){
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function updatePreview(){
      let v = mensajeInput.value || '';
      if (v.length > MAX) v = v.slice(0, MAX);
      if (!ALLOWED_RE.test(v)) {
        v = v.split('').filter(ch => ALLOWED_RE.test(ch)).join('');
        mensajeInput.value = v;
      }
      if (counter) counter.textContent = v.length + '/' + MAX;
      if (preview) preview.innerHTML = v ? escapeHtml(v) : '&nbsp;';
    }

    updatePreview();
    mensajeInput.addEventListener('input', updatePreview);

    // attach dataset to button when clicked (sanitized)
    const addBtn = document.getElementById('btn-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const raw = mensajeInput.value || '';
        const sanitized = raw.split('').filter(ch => ALLOWED_RE.test(ch)).join('').slice(0, MAX);
        addBtn.dataset.mensaje = escapeHtml(sanitized);
      });
    }
  })();

}

function getProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('codigo');
  if (!code) return null;
  return PRODUCTS_PS.find(p => p.code === code);
}

document.addEventListener('DOMContentLoaded', () => {
  const producto = getProductFromURL();
  renderDetalle(producto);
});
