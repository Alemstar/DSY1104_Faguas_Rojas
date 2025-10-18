import CouponInput from "./CouponInput"

export default function CartSummary({ 
  subtotal, 
  discount, 
  total, 
  appliedCoupon,
  onApplyCoupon,
  onClearCart,
  onCheckout,
  isEmpty = false
}) {
  const benefits = [
    { id: 1, text: '-50% para mayores de 50 años (aplica al subtotal)' },
    { id: 2, text: '-10% con código', code: 'FELICESS0' },
    { id: 3, text: '"Torta gratis" en cumpleaños Duoc (una unidad gratis)' }
  ]

  return (
    <div className="cart-summary">
      <div className="cart-summary-header">
        <h2 className="summary-title">TOTAL:</h2>
        <p className="summary-total">${total.toLocaleString('es-CL')}</p>
      </div>

      <div className="benefits-section">
        <h3 className="benefits-title">Beneficios disponibles:</h3>
        <ul className="benefits-list">
          {benefits.map(benefit => (
            <li key={benefit.id} className="benefit-item">
              {benefit.text}
              {benefit.code && (
                <span className="benefit-code"> {benefit.code}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <CouponInput onApplyCoupon={onApplyCoupon} />

      {appliedCoupon && (
        <div className="applied-coupon">
          <p>Cupón aplicado: <strong>{appliedCoupon}</strong></p>
          <p>Descuento: ${discount.toLocaleString('es-CL')}</p>
        </div>
      )}

      <div className="cart-actions">
        <button
          onClick={onClearCart}
          className="clear-cart-btn"
          disabled={isEmpty}
        >
          VACIAR
        </button>
        <button
          onClick={onCheckout}
          className="checkout-btn"
          disabled={isEmpty}
        >
          PAGAR
        </button>
      </div>
    </div>
  )
}
