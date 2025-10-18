export default function SizeSelector({ sizes, selectedSize, onSizeChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor="size-select" style={{ marginRight: '1rem', fontWeight: '500' }}>
        Tamaño
      </label>
      <select
        id="size-select"
        value={selectedSize}
        onChange={(e) => onSizeChange(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          minWidth: '200px'
        }}
      >
        <option value="">Selecciona tamaño</option>
        {sizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  )
}
