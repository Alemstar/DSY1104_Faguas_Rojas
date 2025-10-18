export default function CakeCustomizer({ 
  options, 
  selections, 
  onSelectionChange, 
  onUpdatePreview,
  onAddToCart 
}) {
  const { sizes, shapes, flavors, fillings, pricing } = options
  const { size, shape, flavor, fillings: selectedFillings, message } = selections

  const handleFillingToggle = (fillingId) => {
    const newFillings = selectedFillings.includes(fillingId)
      ? selectedFillings.filter(f => f !== fillingId)
      : [...selectedFillings, fillingId]
    
    onSelectionChange('fillings', newFillings)
  }

  return (
    <div className="cake-customizer">
      {/* Tamaño */}
      <div className="form-group">
        <label htmlFor="size-select" className="form-label">Tamaño:</label>
        <select
          id="size-select"
          value={size?.id || ''}
          onChange={(e) => {
            const selectedSize = sizes.find(s => s.id === e.target.value)
            onSelectionChange('size', selectedSize)
          }}
          className="form-select"
        >
          <option value="">Selecciona tamaño</option>
          {sizes.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Forma */}
      <div className="form-group">
        <label className="form-label">Forma:</label>
        <div className="radio-group">
          {shapes.map(s => (
            <label key={s.id} className="radio-label">
              <input
                type="radio"
                name="shape"
                value={s.id}
                checked={shape === s.id}
                onChange={(e) => onSelectionChange('shape', e.target.value)}
                className="radio-input"
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sabor */}
      <div className="form-group">
        <label htmlFor="flavor-select" className="form-label">Sabor:</label>
        <select
          id="flavor-select"
          value={flavor}
          onChange={(e) => onSelectionChange('flavor', e.target.value)}
          className="form-select"
        >
          <option value="">Selecciona sabor</option>
          {flavors.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Rellenos */}
      <div className="form-group">
        <label className="form-label">Rellenos (puedes elegir varios)</label>
        <div className="checkbox-group">
          {fillings.map(f => (
            <label key={f.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedFillings.includes(f.id)}
                onChange={() => handleFillingToggle(f.id)}
                className="checkbox-input"
              />
              <span>{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      <div className="form-group">
        <label htmlFor="message-input" className="form-label">
          Mensaje en la torta (máx {pricing.maxMessageChars} caracteres)
        </label>
        <input
          id="message-input"
          type="text"
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= pricing.maxMessageChars) {
              onSelectionChange('message', e.target.value)
            }
          }}
          placeholder="Feliz Cumpleaños Ana"
          className="form-input"
          maxLength={pricing.maxMessageChars}
        />
        <div className="char-counter">
          {message.length}/{pricing.maxMessageChars}
        </div>
      </div>

      {/* Botones */}
      <div className="form-actions">
        <button
          onClick={onUpdatePreview}
          className="btn-secondary"
        >
          Actualizar vista previa
        </button>
        <button
          onClick={onAddToCart}
          className="btn-primary"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}
