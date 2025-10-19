import React from 'react'

const timelineEvents = [
  {
    year: "1975",
    description: "Fundación de la pastelería: inicio de la tradición y recetas familiares."
  },
  {
    year: "1988",
    description: "Primeros pedidos internacionales y expansión regional."
  },
  {
    year: "1995",
    description: "Récord Guinness: torta más grande del mundo — hito que nos dio proyección global.",
    highlight: true
  },
  {
    year: "2025",
    description: "Aniversario y consolidación de productos artesanales y sin azúcar."
  }
];

export default function Timeline() {
  return (
    <div className="timeline-wrap" aria-label="Línea de tiempo histórica">
      <ol className="timeline">
        {timelineEvents.map((event) => (
          <li key={event.year} className={`timeline-item ${event.highlight ? 'highlight' : ''}`}>
            <time dateTime={event.year}>{event.year}</time>
            <p>{event.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}