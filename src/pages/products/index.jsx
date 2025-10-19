import { useLoaderData, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import "./products.css"
import SearchBar from "../../components/products/SearchBar"
import CategoriesFilter from "../../components/products/CategoriesFilter"

export default function Products() {
  const productos = useLoaderData() ?? []
  const [searchParams] = useSearchParams()
  const [productosFiltrados, setProductosFiltrados] = useState(productos)
  const initialCategory = searchParams.get('cat')

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
  <div className="products-header-row" style={{ padding: '0rem 2rem', marginTop: '2rem' }}>
    <h1 className="products-title" style={{ margin: 0 }}>Catálogo de productos</h1>
  </div>

  <div className="products-controls" style={{ padding: '0rem 2rem', marginTop: '1rem' }}>
    <div className="controls-left">
      <CategoriesFilter 
        productos={productos} 
        onFilteredProductsChange={setProductosFiltrados}
        initialCategory={initialCategory}
      />
    </div>
    <div className="controls-right">
      <SearchBar 
        productos={productos}
        onFilteredProductsChange={setProductosFiltrados}
      />
    </div>
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
                <button className="add-btn">Añadir</button>
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