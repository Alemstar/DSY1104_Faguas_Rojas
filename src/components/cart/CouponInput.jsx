import { useState } from "react"

export default function CouponInput({ onApplyCoupon }) {
  const [couponCode, setCouponCode] = useState("")

  const handleApply = () => {
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim().toUpperCase())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className="coupon-input-container">
      <label htmlFor="coupon-input" className="coupon-label">Cupón</label>
      <div className="coupon-input-group">
        <input
          id="coupon-input"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ingresa cupón"
          className="coupon-input"
        />
        <button
          onClick={handleApply}
          className="coupon-apply-btn"
        >
          APLICAR
        </button>
      </div>
    </div>
  )
}
