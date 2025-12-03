import React from 'react'
import ProductCard from '../products/ProductCard'
import './Featured.css'

export default function Featured({ products }) {
  // IDs de productos destacados específicos (ajustar según tu base de datos)
  const featuredIds = [1, 2, 3, 4, 5, 6];
  
  const featuredProducts = products.filter(product => 
    featuredIds.includes(product.id) && product.stock > 0
  );

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