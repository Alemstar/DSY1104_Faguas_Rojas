import { useCart } from '../hooks/useCart'
import './Cart.css'

/**
 * Componente de carrito de compras que se conecta al backend
 * @param {Object} props - Props del componente
 * @param {number} props.idCustomer - ID del cliente
 * @returns {JSX.Element} Componente de carrito
 */
export default function Cart({ idCustomer }) {
  const { cart, loading, error, removeProduct } = useCart(idCustomer)

  // Estado de carga
  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">
          <p>Cargando carrito...</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-error">
          <h3>Error al cargar el carrito</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Carrito vacío
  if (!cart || !cart.Products || cart.Products.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para comenzar a comprar</p>
        </div>
      </div>
    )
  }

  // Maneja la eliminación de un producto
  const handleRemoveProduct = (productName) => {
    if (window.confirm(`¿Deseas eliminar "${productName}" del carrito?`)) {
      removeProduct(productName)
    }
  }

  return (
    <div className="cart-container">
      <div className="cart-info">
        <h2>Carrito de Compras</h2>
        <div className="cart-details">
          <p><strong>ID Carrito:</strong> {cart.id_cart}</p>
          <p><strong>Cliente:</strong> {cart.id_customer}</p>
          <p><strong>Total:</strong> ${cart.total?.toLocaleString('es-CL') || 0}</p>
        </div>
      </div>

      <div className="cart-products">
        <h3>Productos ({cart.Products.length})</h3>
        <ul className="cart-products-list">
          {cart.Products.map((product, index) => (
            <li key={`${product}-${index}`} className="cart-product-item">
              <span className="product-name">{product}</span>
              <button 
                className="btn-remove"
                onClick={() => handleRemoveProduct(product)}
                aria-label={`Eliminar ${product}`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
