import React from 'react'
import FeaturedGrid from './FeaturedGrid'
import './featured.css'

export default function Featured({ products = [], title = 'Destacados', maxItems = 6 }) {
  const items = products.slice(0, maxItems)

  return (
    <section className="featured">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <FeaturedGrid products={items} />
      </div>
    </section>
  )
}
