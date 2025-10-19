import React from 'react'
import ProductCard from '../products/ProductCard'
import './featured.css'

export default function FeaturedGrid({ products = [], columns = 4 }) {
  if (!Array.isArray(products) || products.length === 0) {
    return <div className="featured-empty">No hay productos destacados</div>
  }

  return (
    <div className="featured-grid" style={{ ['--cols']: columns }}>
      {products.map(p => (
        <ProductCard key={p.code ?? p.nombre} product={p} />
      ))}
    </div>
  )
}
