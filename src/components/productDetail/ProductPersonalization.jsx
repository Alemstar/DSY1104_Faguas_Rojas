import { useState } from "react"

export default function ProductPersonalization({ maxChars = 50, onMessageChange }) {
  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const newMessage = e.target.value
    if (newMessage.length <= maxChars) {
      setMessage(newMessage)
      onMessageChange(newMessage)
    }
  }

  return (
    <div className="product-personalization">
      <h3 className="personalization-title">Personaliza tu producto</h3>
      
      <div className="personalization-field">
        <label htmlFor="message-input" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Mensaje para la torta:
        </label>
        <input
          id="message-input"
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Escribe tu mensaje aquí..."
          maxLength={maxChars}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}
        />
        <div style={{ 
          textAlign: 'right', 
          fontSize: '0.9rem', 
          color: message.length >= maxChars ? '#d32f2f' : '#666' 
        }}>
          {message.length}/{maxChars}
        </div>
      </div>
    </div>
  )
}
