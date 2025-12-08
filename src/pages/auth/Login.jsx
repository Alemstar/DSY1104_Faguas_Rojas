import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/auth'
import { loginUser } from '../../api/customers'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFeedback('')
  }, [])

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFeedback('')
    if (!validateEmail(email)) return setFeedback('Email inválido')
    if (!password || password.length < 4 || password.length > 10) return setFeedback('Password debe tener entre 4 y 10 caracteres')

    setLoading(true)
    try {
      // Llamar al backend real
      const response = await loginUser(email.trim(), password)
      
      console.log('Login response:', response) // Debug
      
      // Guardar sesión localmente
      const payload = { 
        email: response.email || email,
        nombre: response.name || '',
        apellidos: response.lastName || '',
        customerId: response.userId,
        at: new Date().toISOString() 
      }
      localStorage.setItem('sesionIniciada', JSON.stringify(payload))
      
      setFeedback('Sesión iniciada correctamente')
      setTimeout(() => navigate('/'), 600)
    } catch (err) {
      console.error('Error en login:', err)
      setFeedback(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
  <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2>Iniciar sesión</h2>
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          loading={loading}
          feedback={feedback}
          title="Iniciar sesión"
        />
      </div>
    </main>
  )
}
