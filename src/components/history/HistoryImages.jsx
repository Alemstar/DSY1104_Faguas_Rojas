import React from 'react'

export default function HistoryImages() {
  const resolveImage = (relativePath) => {
    try {
      return new URL(`../../assets/${relativePath}`, import.meta.url).href;
    } catch (_) {
      return relativePath;
    }
  };

  return (
    <div className="history-images" aria-hidden="false">
      <figure>
        <img 
          src={resolveImage('reposteria.png')}
          loading="lazy" 
          decoding="async" 
          alt="Preparativos de la torta histórica" 
          width="1200" 
          height="800" 
        />
      </figure>
      <figure>
        <img 
          src={resolveImage('postres_linea_de_tiempo.jpg')}
          loading="lazy" 
          decoding="async" 
          alt="Detalle y acabado de la torta" 
          width="1200" 
          height="800" 
        />
      </figure>
    </div>
  )
}