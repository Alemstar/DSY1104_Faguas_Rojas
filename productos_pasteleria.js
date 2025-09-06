/**
 * @typedef {Object} ProductoPasteleria
 * @property {string} code - Código único del producto
 * @property {string} nombre - Nombre del producto
 * @property {string} categoriaId - Categoría (TC, TT, PI, PSA, PT, PG, PV, TE)
 * @property {('cuadrada'|'circular'|null)} tipoForma - Forma del producto
 * @property {string[]} tamanosDisponibles - Tamaños disponibles
 * @property {number} precioCLP - Precio en CLP
 * @property {number} stock - Stock disponible
 * @property {string} descripcion - Descripción del producto
 * @property {boolean} personalizable - Si es personalizable
 * @property {number} maxMsgChars - Máx. caracteres para mensaje personalizado
 * @property {string} imagen - URL de la imagen
 */

/**
 * Formatea un número como moneda CLP
 * @param {number} valor
 * @returns {string}
 */
export function formatoCLP(valor) {
  return valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
}

export const PRODUCTS_PS = [
  {
    code: "TC001",
    nombre: "Torta Cuadrada de Chocolate",
    categoriaId: "TC",
    tipoForma: "cuadrada",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)", "L (20 porciones)"],
    precioCLP: 45000,
    stock: 10,
    descripcion: "Deliciosa torta de chocolate con ganache y toque de avellanas. Ideal para personalizar con mensaje.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta cuadrada de chocolate.jpg"
  },
  {
    code: "TC002",
    nombre: "Torta Cuadrada de Frutas",
    categoriaId: "TC",
    tipoForma: "cuadrada",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)", "L (20 porciones)"],
    precioCLP: 50000,
    stock: 8,
    descripcion: "Bizcocho de vainilla con frutas frescas y crema chantilly.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Cuadrada de Frutas.jpg"
  },
  {
    code: "TT001",
    nombre: "Torta Circular de Vainilla",
    categoriaId: "TT",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)", "L (20 porciones)"],
    precioCLP: 40000,
    stock: 12,
    descripcion: "Vainilla clásica rellena con crema pastelera y glaseado dulce.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Circular de Vainilla.jpg"
  },
  {
    code: "TT002",
    nombre: "Torta Circular de Manjar",
    categoriaId: "TT",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)", "L (20 porciones)"],
    precioCLP: 42000,
    stock: 9,
    descripcion: "Clásica torta chilena con manjar y nueces.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Circular de Manjar.jpg"
  },
  {
    code: "PI001",
    nombre: "Mousse de Chocolate",
    categoriaId: "PI",
    tipoForma: null,
    tamanosDisponibles: ["unidad"],
    precioCLP: 5000,
    stock: 40,
    descripcion: "Postre cremoso con chocolate de alta calidad.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Mousse de Chocolate.jpg"
  },
  {
    code: "PI002",
    nombre: "Tiramisú Clásico",
    categoriaId: "PI",
    tipoForma: null,
    tamanosDisponibles: ["unidad"],
    precioCLP: 5500,
    stock: 36,
    descripcion: "Café, mascarpone y cacao en un equilibrio perfecto.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Tiramisú Clásico.jpg"
  },
  {
    code: "PSA001",
    nombre: "Torta Sin Azúcar de Naranja",
    categoriaId: "PSA",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)"],
    precioCLP: 48000,
    stock: 7,
    descripcion: "Endulzada naturalmente para quienes buscan opciones más saludables.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Sin Azúcar de Naranja.jpg"
  },
  {
    code: "PSA002",
    nombre: "Cheesecake Sin Azúcar",
    categoriaId: "PSA",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)"],
    precioCLP: 47000,
    stock: 6,
    descripcion: "Suave y cremoso, ideal para disfrutar sin culpa.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Cheesecake Sin Azúcar.jpg"
  },
  {
    code: "PT001",
    nombre: "Empanada de Manzana",
    categoriaId: "PT",
    tipoForma: null,
    tamanosDisponibles: ["unidad"],
    precioCLP: 3000,
    stock: 50,
    descripcion: "Rellena de manzanas especiadas, perfecta para el desayuno o merienda.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Empanada de Manzana.jpg"
  },
  {
    code: "PT002",
    nombre: "Tarta de Santiago",
    categoriaId: "PT",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)"],
    precioCLP: 6000,
    stock: 22,
    descripcion: "Clásica tarta de almendras, azúcar y huevos.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Tarta de Santiago.jpg"
  },
  {
    code: "PG001",
    nombre: "Brownie Sin Gluten",
    categoriaId: "PG",
    tipoForma: "cuadrada",
    tamanosDisponibles: ["unidad"],
    precioCLP: 4000,
    stock: 35,
    descripcion: "Denso y sabroso, libre de gluten.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Brownie Sin Gluten.jpg"
  },
  {
    code: "PG002",
    nombre: "Pan Sin Gluten",
    categoriaId: "PG",
    tipoForma: null,
    tamanosDisponibles: ["unidad"],
    precioCLP: 3500,
    stock: 28,
    descripcion: "Suave y esponjoso, ideal para sándwiches.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Pan Sin Gluten.jpg"
  },
  {
    code: "PV001",
    nombre: "Torta Vegana de Chocolate",
    categoriaId: "PV",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)"],
    precioCLP: 50000,
    stock: 6,
    descripcion: "Húmeda y deliciosa, sin ingredientes de origen animal.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Vegana de Chocolate.jpg"
  },
  {
    code: "PV002",
    nombre: "Galletas Veganas de Avena",
    categoriaId: "PV",
    tipoForma: null,
    tamanosDisponibles: ["unidad"],
    precioCLP: 4500,
    stock: 40,
    descripcion: "Crujientes y sabrosas, perfectas para colación.",
    personalizable: false,
    maxMsgChars: 0,
    imagen: "assets/Galletas Veganas de Avena.jpg"
  },
  {
    code: "TE001",
    nombre: "Torta Especial de Cumpleaños",
    categoriaId: "TE",
    tipoForma: "circular",
    tamanosDisponibles: ["S (8 porciones)", "M (12 porciones)", "L (20 porciones)"],
    precioCLP: 55000,
    stock: 7,
    descripcion: "Pensada para celebrar: admite decoraciones temáticas y mensaje.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Especial de Cumpleaños.jpg"
  },
  {
    code: "TE002",
    nombre: "Torta Especial de Boda",
    categoriaId: "TE",
    tipoForma: "circular",
    tamanosDisponibles: ["M (12 porciones)", "L (20 porciones)"],
    precioCLP: 60000,
    stock: 4,
    descripcion: "Elegante y memorable; lista para personalizar.",
    personalizable: true,
    maxMsgChars: 50,
    imagen: "assets/Torta Especial de Boda.jpg"
  }
];
