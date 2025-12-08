import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../../components/auth'
import { registerUser } from '../../api/customers'

export default function Register(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', fechaNacimiento: '', password: '', codigoPromo: '' })
  const [feedback, setFeedback] = useState('')

  function updateField(e){
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validateEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleSubmit(e){
    e.preventDefault()
    setFeedback('')
    const errores = []
    if (!form.nombre.trim()) errores.push('Nombre es obligatorio')
    if (!form.apellidos.trim()) errores.push('Apellidos son obligatorios')
    if (!form.email || !validateEmail(form.email) || form.email.length > 100) errores.push('Email inválido')
    if (!form.fechaNacimiento) errores.push('Fecha de nacimiento es obligatoria')
    if (!form.password || form.password.length < 4 || form.password.length > 10) errores.push('Password debe tener entre 4 y 10 caracteres')

    if (errores.length) {
      setFeedback(errores.join('\n'))
      return
    }

    try {
      // Preparar datos para el backend
      const userData = {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email.trim(),
        fechaNacimiento: form.fechaNacimiento,
        password: form.password,
        codigoPromo: form.codigoPromo.trim() || undefined
      }

      // Llamar al backend real
      await registerUser(userData)

      setFeedback('Usuario registrado correctamente')
      setTimeout(() => navigate('/login'), 900)
    } catch (err) {
      console.error('Error en registro:', err)
      setFeedback(err.message || 'Error al registrar usuario. Por favor intenta nuevamente.')
    }
  }

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
  <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2>Registro de usuario</h2>
  <RegisterForm title="Registro de usuario" form={form} updateField={updateField} onSubmit={handleSubmit} feedback={feedback} />
      </div>
    </main>
  )
}
