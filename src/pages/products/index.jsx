import { useState, useEffect, useMemo } from 'react'
import { useLoaderData, Link, useSearchParams } from 'react-router-dom'
import './products.css'
import SearchBar from '../../components/products/SearchBar'
import PriceFilter from '../../components/products/PriceFilter'
import CategoriesFilter from '../../components/products/CategoriesFilter'

export default function Products() {
  const productos = useLoaderData() ?? []
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('cat') || ""

  // Estados para cada filtro
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedCategoria, setSelectedCategoria] = useState(initialCategory)
  const [selectedTipo, setSelectedTipo] = useState('')
  const [selectedTamano, setSelectedTamano] = useState('')
  const [selectedEtiquetas, setSelectedEtiquetas] = useState([])

  // Aplicar todos los filtros de forma combinada
  const productosFiltrados = useMemo(() => {
    let filtered = [...productos]

    // 1. Filtrar por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(producto =>
        producto.nombre?.toLowerCase().includes(searchLower) ||
        String(producto.id)?.includes(searchTerm)
      )
    }

    // 2. Filtrar por categoría
    if (selectedCategoria) {
      filtered = filtered.filter(p => 
        (p.categoriaId || '').toString() === selectedCategoria.toString()
      )
    }

    // 3. Filtrar por tipo de forma
    if (selectedTipo) {
      filtered = filtered.filter(p => 
        (p.tipoForma || '').toString() === selectedTipo.toString()
      )
    }

    // 4. Filtrar por tamaño
    if (selectedTamano) {
      const mapTam = { chica: 'S', mediana: 'M', grande: 'L' }
      const prefix = mapTam[selectedTamano]
      if (prefix) {
        filtered = filtered.filter(p => {
          const sizes = Array.isArray(p.tamanosDisponibles) ? p.tamanosDisponibles : []
          return sizes.some(s => s.trim().startsWith(prefix))
        })
      }
    }

    // 5. Filtrar por etiquetas
    if (selectedEtiquetas.length > 0) {
      const etiquetaMap = {
        sin_azucar: 'Postres Sin Azúcar',
        sin_gluten: 'Postres Sin Gluten',
        vegana: 'Postres Veganos',
        tradicional: 'Postres Tradicionales',
        especial: 'Tortas Especiales'
      }
      filtered = filtered.filter(p => {
        return selectedEtiquetas.some(et => {
          const expectedCat = etiquetaMap[et]
          if (!expectedCat) return false
          return (p.categoriaId || '').toString() === expectedCat
        })
      })
    }

    // 6. Ordenar por precio
    filtered.sort((a, b) => {
      const precioA = a.precioCLP ?? 0
      const precioB = b.precioCLP ?? 0
      return sortOrder === 'asc' ? precioA - precioB : precioB - precioA
    })

    return filtered
  }, [productos, searchTerm, sortOrder, selectedCategoria, selectedTipo, selectedTamano, selectedEtiquetas])

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
              selectedCategoria={selectedCategoria}
              setSelectedCategoria={setSelectedCategoria}
              selectedTipo={selectedTipo}
              setSelectedTipo={setSelectedTipo}
              selectedTamano={selectedTamano}
              setSelectedTamano={setSelectedTamano}
              selectedEtiquetas={selectedEtiquetas}
              setSelectedEtiquetas={setSelectedEtiquetas}
            />
          </div>
          
          <div className="controls-right">
            <PriceFilter sortOrder={sortOrder} setSortOrder={setSortOrder} />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
                <Link to={`/productos/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                  </div>
                </Link>
                <div className="card-footer">
                  <span className="product-price">
                    ${producto.precioCLP ? producto.precioCLP.toLocaleString('es-CL') : '0'}
                  </span>
                  <Link to={`/productos/${producto.id}`} className="add-btn">Añadir</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}