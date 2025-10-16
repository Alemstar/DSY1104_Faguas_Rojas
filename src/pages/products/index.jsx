import { useLoaderData } from "react-router-dom"
import "./products.css"

export default function Products() {
  const productos = useLoaderData() ?? []

  const resolveImage = (relativePath) => {
    if (!relativePath) return null;
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  }

  return (
    <div>
        <h1 className="products-title">Catálogo de productos</h1>
      {productos.length === 0 ? (
        <div className="loading-container">No hay productos para mostrar</div>
      ) : (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto.code ?? producto.nombre} className="product-card custom-card">
              {producto.imagen && (
                <div className="card-img-container">
                  <img
                    src={resolveImage(producto.imagen)}
                    alt={producto.nombre}
                    className="product-image"
                  />
                </div>
              )}
              <div className="card-body">
                <h3 className="card-title">{producto.nombre}</h3>
                <p className="card-desc">{producto.descripcion}</p>
                <div className="card-footer">
                  <span className="product-price">${producto.precioCLP?.toLocaleString('es-CL')}</span>
                  <button className="add-btn">Añadir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}