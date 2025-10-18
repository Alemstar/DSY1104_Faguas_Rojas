import { useLoaderData, Link } from "react-router-dom"
import { useState } from "react"
import "./products.css"
import SearchBar from "../../components/products/SearchBar"

export default function Products() {
  const productos = useLoaderData() ?? []
  const [productosFiltrados, setProductosFiltrados] = useState(productos)

  const resolveImage = (relativePath) => {
    if (!relativePath) return null;
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  }

  return (
<>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0rem 3rem', marginTop: '2rem' }} className="products-header-row">
    <h1 className="products-title" style={{ margin: 0 }}>Catálogo de productos</h1>
    <SearchBar 
      productos={productos}
      onFilteredProductsChange={setProductosFiltrados}
    />
  </div>

  <div>
    {productosFiltrados.length === 0 ? (
      <div className="loading-container">No hay productos para mostrar</div>
    ) : (
      <div className="products-grid">
        {productosFiltrados.map((producto) => (
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
                <Link to={`/productos/${producto.code}`} className="add-btn">
                  Añadir
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</>
  )
}