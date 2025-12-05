import { useNavigate } from "react-router-dom";

const categories = [
  { code: "Tortas Cuadradas", label: "Cuadradas", desc: "Tortas cuadradas", sr: "Ver productos de tortas cuadradas" },
  { code: "Tortas Circulares", label: "Circulares", desc: "Tortas redondas tradicionales", sr: "Ver productos de tortas circulares" },
  { code: "Postres Individuales", label: "Postres", desc: "Variedad de postres", sr: "Ver nuestra selección de postres" },
  { code: "Postres Sin Azúcar", label: "Sin azúcar", desc: "Productos sin azúcar", sr: "Ver productos sin azúcar" },
  { code: "Postres Tradicionales", label: "Tradicional", desc: "Recetas clásicas", sr: "Ver productos tradicionales" },
  { code: "Postres Sin Gluten", label: "Sin gluten", desc: "Productos libres de gluten", sr: "Ver productos sin gluten" },
  { code: "Postres Veganos", label: "Vegana", desc: "100% productos de origen vegetal", sr: "Ver productos veganos" },
  { code: "Tortas Especiales", label: "Especiales", desc: "Tortas para ocasiones únicas", sr: "Ver productos especiales" },
];

export default function Categories() {
  const navigate = useNavigate();

  function goToCategory(catCode) {
    localStorage.setItem("selectedCategory", catCode);
    navigate(`/productos?cat=${catCode}`);
  }

  return (
    <section className="categories">
      <h2 className="display-4 mb-3 section-title" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)', textAlign: 'center' }}>Categorías</h2>
      <div className="container">
        <ul className="tiles" role="navigation" aria-label="Listado de categorías">
          {categories.map(cat => (
            <li key={cat.code}>
              <button
                className="tile"
                tabIndex={0}
                aria-label={`Categoría: ${cat.label}`}
                onClick={() => goToCategory(cat.code)}
              >
                <strong>{cat.label}</strong>
                <span className="muted" id={`desc-${cat.code.toLowerCase()}`}>{cat.desc}</span>
                <span className="sr-only">{cat.sr}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
