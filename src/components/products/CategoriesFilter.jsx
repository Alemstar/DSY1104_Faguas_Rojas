// Opciones de filtro - ahora el value es el nombre de la categoría
const categorias = [
  { value: "Tortas Cuadradas", label: "Cuadradas" },
  { value: "Tortas Circulares", label: "Circulares" },
  { value: "Postres Individuales", label: "Postres" },
  { value: "Postres Sin Azúcar", label: "Sin azúcar" },
  { value: "Postres Tradicionales", label: "Tradicional" },
  { value: "Postres Sin Gluten", label: "Sin gluten" },
  { value: "Postres Veganos", label: "Vegana" },
  { value: "Tortas Especiales", label: "Especiales" },
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

export default function CategoriesFilter({ 
  selectedCategoria,
  setSelectedCategoria,
  selectedTipo,
  setSelectedTipo,
  selectedTamano,
  setSelectedTamano,
  selectedEtiquetas,
  setSelectedEtiquetas
}) {
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
                id="filter-categoria"
                name="categoria"
                aria-label="Filtrar por categoría"
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
                id="filter-tipo"
                name="tipo"
                aria-label="Filtrar por tipo"
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
                id="filter-tamano"
                name="tamano"
                aria-label="Filtrar por tamaño"
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
                    id={`etiqueta-${etq.value}`}
                    name={`etiqueta-${etq.value}`}
                    aria-label={`Filtrar por ${etq.label}`}
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
