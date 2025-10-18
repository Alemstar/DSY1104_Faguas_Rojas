export default function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }) {
  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min
    if (value >= min && value <= max) {
      onQuantityChange(value)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="quantity-input" style={{ marginRight: '1rem', fontWeight: '500' }}>
        Cantidad
      </label>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={handleDecrement}
          disabled={quantity <= min}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            cursor: quantity <= min ? 'not-allowed' : 'pointer'
          }}
        >
          -
        </button>
        <input
          id="quantity-input"
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={min}
          max={max}
          style={{
            width: '80px',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        />
        <button
          onClick={handleIncrement}
          disabled={quantity >= max}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            cursor: quantity >= max ? 'not-allowed' : 'pointer'
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}
