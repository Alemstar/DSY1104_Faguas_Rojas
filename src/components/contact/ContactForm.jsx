import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor completa todos los campos')
      return
    }

    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData)
    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.')
    
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      message: ''
    })
  }

  return (
    <div className="contact-form-container">
      <h1 className="contact-form-title">Formulario de Contacto</h1>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Comentario
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="form-submit-btn">
          Enviar mensaje
        </button>
      </form>
    </div>
  )
}
