import React from 'react'

export default function HistoryHero() {
  const resolveImage = (relativePath) => {
    try {
      return new URL(`../../assets/${relativePath}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  };

  return (
    <div className="history-hero">
      <div className="history-hero-content">
        <h3>Hito Guinness 1995</h3>
        <p className="history-lead">
          En 1995 obtuvimos el Récord Guinness por la torta más grande del mundo. 
          Este reconocimiento marcó un antes y un después en nuestra pastelería y 
          consolidó nuestra pasión por la innovación.
        </p>
        <ul className="history-claims">
          <li><strong>Año:</strong> 1995</li>
          <li><strong>Récord:</strong> Torta más grande del mundo</li>
          <li><strong>Impacto:</strong> Reconocimiento internacional</li>
        </ul>
        <div className="history-hero-image">
          <img 
            src={resolveImage('experto-pasteleria-reposteria-postres.jpg')}
            alt="Récord Guinness 1995 - Torta más grande del mundo"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}