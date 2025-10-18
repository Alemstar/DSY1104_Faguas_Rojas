import { Link } from "react-router-dom"

export default function RelatedProducts({ productos, currentProductCode }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  // Filtrar productos relacionados (misma categoría, excluyendo el producto actual)
  const productosRelacionados = productos
    .filter(p => p.code !== currentProductCode)
    .slice(0, 4) // Mostrar máximo 4 productos

  if (productosRelacionados.length === 0) {
    return null
  }

  return (
    <div className="related-products-section">
      <h2 className="related-products-title">Productos relacionados</h2>
      
      <div className="related-products-grid">
        {productosRelacionados.map((producto) => (
          <Link 
            key={producto.code} 
            to={`/productos/${producto.code}`}
            className="related-product-card"
          >
            {producto.imagen && (
              <div className="related-product-image">
                <img
                  src={resolveImage(producto.imagen)}
                  alt={producto.nombre}
                />
              </div>
            )}
            <h3 className="related-product-name">{producto.nombre}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
