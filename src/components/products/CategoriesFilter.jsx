import { useEffect, useState } from "react";

// Opciones de filtro
const categorias = [
  { value: "TC", label: "Cuadradas" },
  { value: "TT", label: "Circulares" },
  { value: "PI", label: "Postres" },
  { value: "PSA", label: "Sin azúcar" },
  { value: "PT", label: "Tradicional" },
  { value: "PG", label: "Sin gluten" },
  { value: "PV", label: "Vegana" },
  { value: "TE", label: "Especiales" },
];

const tipos = [
  { value: "cuadrada", label: "Torta Cuadrada" },
  { value: "circular", label: "Torta Circular" },
];

const etiquetas = [
  { value: "sin_azucar", label: "Sin azúcar" },
  { value: "sin_gluten", label: "Sin gluten" },
  { value: "vegana", label: "Vegana" },
  { value: "tradicional", label: "Tradicional" },
  { value: "especial", label: "Especial" },
];

const tamanos = [
  { value: "chica", label: "Chica" },
  { value: "mediana", label: "Mediana" },
  { value: "grande", label: "Grande" },
];

export default function CategoriesFilter({ productos = [], onFilteredProductsChange, initialCategory = "" }) {
  // estados locales de selección
  const [selectedCategoria, setSelectedCategoria] = useState(initialCategory);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedTamano, setSelectedTamano] = useState("");
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([]);

  // Efecto que aplica el filtrado cuando cambian productos o selecciones
  useEffect(() => {
    let filtered = Array.isArray(productos) ? [...productos] : [];

    // Filtrar por categoría (usa `categoriaId` en el dataset)
    if (selectedCategoria) {
      filtered = filtered.filter(p => (p.categoriaId || "").toString() === selectedCategoria.toString());
    }

    // Filtrar por tipo de forma (`tipoForma` en dataset)
    if (selectedTipo) {
      filtered = filtered.filter(p => (p.tipoForma || "").toString() === selectedTipo.toString());
    }

    // Filtrar por tamaño: mapear 'chica'->'S', 'mediana'->'M', 'grande'->'L'
    if (selectedTamano) {
      const mapTam = { chica: 'S', mediana: 'M', grande: 'L' };
      const prefix = mapTam[selectedTamano];
      if (prefix) {
        filtered = filtered.filter(p => {
          const sizes = Array.isArray(p.tamanosDisponibles) ? p.tamanosDisponibles : [];
          return sizes.some(s => s.trim().startsWith(prefix));
        });
      }
    }

    // Filtrar por etiquetas: en el dataset no hay campo 'etiquetas'; usamos categoriaId como proxy
    if (selectedEtiquetas.length > 0) {
      const etiquetaMap = {
        sin_azucar: 'PSA',
        sin_gluten: 'PG',
        vegana: 'PV',
        tradicional: 'PT',
        especial: 'TE'
      };
      filtered = filtered.filter(p => {
        return selectedEtiquetas.every(et => {
          const expectedCat = etiquetaMap[et];
          if (!expectedCat) return true;
          return (p.categoriaId || "").toString() === expectedCat;
        });
      });
    }

    if (onFilteredProductsChange) onFilteredProductsChange(filtered);
  }, [productos, selectedCategoria, selectedTipo, selectedTamano, selectedEtiquetas, onFilteredProductsChange]);

  function toggleEtiqueta(value) {
    setSelectedEtiquetas(prev => (
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    ));
  }

  function limpiarFiltros() {
    setSelectedCategoria("");
    setSelectedTipo("");
    setSelectedTamano("");
    setSelectedEtiquetas([]);
  }

  return (
    <section className="categories">
      <div className="container">
        <h2 className="section-title">Filtros</h2>
        <div className="filters-grid">
          <div className="filters-row">
            <div className="filter-item">
              <strong>Categoría</strong>
              <select
                value={selectedCategoria}
                onChange={e => setSelectedCategoria(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <strong>Tipo</strong>
              <select
                value={selectedTipo}
                onChange={e => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos</option>
                {tipos.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <strong>Tamaño</strong>
              <select
                value={selectedTamano}
                onChange={e => setSelectedTamano(e.target.value)}
              >
                <option value="">Todos</option>
                {tamanos.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filters-tags">
            <strong>Etiquetas</strong>
            <div className="tags-list">
              {etiquetas.map(etq => (
                <label key={etq.value} className="tag-pill">
                  <input
                    type="checkbox"
                    checked={selectedEtiquetas.includes(etq.value)}
                    onChange={() => toggleEtiqueta(etq.value)}
                  />
                  <span>{etq.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filters-actions">
            <button type="button" onClick={limpiarFiltros}>Limpiar</button>
          </div>
        </div>
      </div>
    </section>
  );
}
