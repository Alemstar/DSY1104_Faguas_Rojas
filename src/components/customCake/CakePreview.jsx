export default function CakePreview({ selections, estimatedPrice }) {
  const { size, shape, flavor, fillings, message } = selections

  return (
    <div className="cake-preview">
      <h2 className="preview-title">Detalles previos de tu torta</h2>

      <div className="preview-details">
        <div className="preview-item">
          <span className="preview-label">Tamaño:</span>
          <span className="preview-value">{size?.label || '—'}</span>
        </div>

        <div className="preview-item">
          <span className="preview-label">Forma:</span>
          <span className="preview-value">{shape || '—'}</span>
        </div>

        <div className="preview-item">
          <span className="preview-label">Sabor:</span>
          <span className="preview-value">{flavor || '—'}</span>
        </div>

        <div className="preview-item">
          <span className="preview-label">Rellenos:</span>
          <span className="preview-value">
            {fillings.length > 0 ? fillings.join(', ') : 'Sin relleno'}
          </span>
        </div>

        <div className="preview-item">
          <span className="preview-label">Mensaje:</span>
          <span className="preview-value">{message || '—'}</span>
        </div>

        <div className="preview-price">
          <span className="price-label">Estimación precio:</span>
          <span className="price-value">${estimatedPrice.toLocaleString('es-CL')}</span>
        </div>
      </div>
    </div>
  )
}
