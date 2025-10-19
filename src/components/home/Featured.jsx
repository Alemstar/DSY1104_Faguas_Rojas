import React from 'react'
import ProductCard from '../products/ProductCard'
import './Featured.css'

export default function Featured({ products }) {
  // Códigos de productos destacados específicos
  const featuredCodes = ['TE001', 'PSA002', 'TC001', 'TT002', 'TC002', 'PSA001'];
  
  const featuredProducts = products.filter(product => 
    featuredCodes.includes(product.code) && product.stock > 0
  );

  return (
    <section className="featured-section">
      <h2 className="featured-title">Productos Destacados</h2>
      <div className="featured-grid">
        {featuredProducts.map(product => (
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
    </section>
  )
}