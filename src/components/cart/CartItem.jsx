export default function CartItem({ item, onQuantityChange, onRemove }) {
  const resolveImage = (relativePath) => {
    if (!relativePath) return null
    try {
      return new URL(`../../assets/${relativePath.split('/').pop()}`, import.meta.url).href
    } catch (_) {
      return relativePath
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    onQuantityChange(item.id, newQuantity)
  }

  const itemTotal = item.producto.precioCLP * item.quantity

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.producto.imagen && (
          <img
            src={resolveImage(item.producto.imagen)}
            alt={item.producto.nombre}
          />
        )}
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.producto.nombre}</h3>
        {item.size && item.size !== 'unidad' && (
          <p className="cart-item-size">Tamaño: {item.size}</p>
        )}
        {item.customDetails && (
          <div className="cart-item-custom-details">
            <p className="cart-item-detail">Forma: {item.customDetails.shape}</p>
            <p className="cart-item-detail">Sabor: {item.customDetails.flavor}</p>
            {item.customDetails.fillings && item.customDetails.fillings.length > 0 && (
              <p className="cart-item-detail">Rellenos: {item.customDetails.fillings.join(', ')}</p>
            )}
          </div>
        )}
        {item.personalizationMessage && (
          <p className="cart-item-message">Mensaje: "{item.personalizationMessage}"</p>
        )}
        
        <div className="cart-item-quantity">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="quantity-btn"
          >
            -
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
          >
            +
          </button>
        </div>
      </div>

      <div className="cart-item-price">
        <p className="item-price">${itemTotal.toLocaleString('es-CL')}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="remove-item-btn"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
