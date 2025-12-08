import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null;
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  }

  // Obtener el ID del producto (normalizado desde la API)
  const productId = product.id || product.product_id || product.idProduct || product.code;

  return (
    <div className="product-card custom-card">
      <Link to={`/productos/${productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.imagen && (
          <div className="card-img-container">
            <img
              src={resolveImage(product.imagen)}
              alt={product.nombre}
              className="product-image"
            />
          </div>
        )}
        <div className="card-body">
          <h3 className="card-title">{product.nombre}</h3>
          <p className="card-desc">{product.descripcion}</p>
        </div>
      </Link>
      <div className="card-footer">
        <span className="product-price">
          ${product.precioCLP ? product.precioCLP.toLocaleString('es-CL') : '0'}
        </span>
        <Link 
          to={`/productos/${productId}`}
          className="add-btn"
          style={{ textDecoration: 'none' }}
        >
          Añadir
        </Link>
      </div>
    </div>
  )
}