import { useState, useEffect } from 'react'
import { useLoaderData, Link, useSearchParams } from 'react-router-dom'
import './products.css'
import SearchBar from '../../components/products/SearchBar'
import PriceFilter from '../../components/products/PriceFilter'
import CategoriesFilter from '../../components/products/CategoriesFilter'

export default function Products() {
  const productos = useLoaderData() ?? []
  const [searchParams] = useSearchParams()
  const [productosFiltrados, setProductosFiltrados] = useState(productos)
  const initialCategory = searchParams.get('cat') || ""

  useEffect(() => {
    setProductosFiltrados(productos)
  }, [productos])

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
      <div className="products-header">
        <h1 className="products-title">Catálogo de productos</h1>
        
        <div className="products-controls">
          <div className="controls-left">
            <CategoriesFilter
              productos={productos}
              onFilteredProductsChange={setProductosFiltrados}
              initialCategory={initialCategory}
            />
          </div>
          
          <div className="controls-right">
            <PriceFilter productos={productos} onFilteredProductsChange={setProductosFiltrados} />
            <SearchBar productos={productos} onFilteredProductsChange={setProductosFiltrados} />
          </div>
        </div>
      </div>

      <div className="products-grid-wrapper">
        {productosFiltrados.length === 0 ? (
          <div className="loading-container">No hay productos para mostrar</div>
        ) : (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <div key={producto.id ?? producto.nombre} className="product-card custom-card">
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
                    <Link to={`/productos/${producto.id}`} className="add-btn">Añadir</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}