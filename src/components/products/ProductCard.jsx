import React from 'react'

export default function ProductCard({ product, onAdd }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null;
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  }

  const handleAdd = () => {
    if (onAdd) {
      onAdd(product);
    } else {
      console.log('Add clicked:', product.code);
    }
  };

  return (
    <div className="product-card custom-card">
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
        <div className="card-footer">
          <span className="product-price">
            ${product.precioCLP?.toLocaleString('es-CL')}
          </span>
          <button 
            className="add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  )
}