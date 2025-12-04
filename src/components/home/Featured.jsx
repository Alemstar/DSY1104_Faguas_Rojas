import React from 'react'
import ProductCard from '../products/ProductCard'
import './Featured.css'

export default function Featured({ products }) {
  // Mostrar primeros 6 productos con stock disponible
  const featuredProducts = Array.isArray(products) 
    ? products.filter(product => product.stock > 0).slice(0, 6)
    : [];

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="featured-section">
      <h2 className="featured-title">Productos Destacados</h2>
      <div className="featured-grid">
        {featuredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}