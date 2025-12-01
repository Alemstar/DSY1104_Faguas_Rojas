import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout, isAuthenticated } from '../../services/auth'

export default function SessionLinks(){
  const [session, setSession] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsClient(true)
    const user = getCurrentUser()
    setSession(user)
    
    const onStorage = () => {
      if (isAuthenticated()) {
        setSession(getCurrentUser())
      } else {
        setSession(null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  async function handleLogout(){
    try {
      await logout()
      setSession(null)
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Aún así redirigimos al home
      navigate('/')
    }
  }

  return (
    <div className="session-links" style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
      {!isClient ? null : session ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ color: 'var(--text)', fontWeight: 700 }}>{session.nombre} {session.apellidos}</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/perfil" className="btn-link" aria-label="Ver perfil" style={{ padding: '0.35rem 0.8rem' }}>Ver perfil</Link>
            <button className="btn-link" onClick={handleLogout} style={{ marginLeft: 0 }}>Cerrar sesión</button>
          </div>
        </div>
      ) : (
        <>
          <Link to="/login" className="btn-link">Iniciar sesión</Link>
          <span style={{ margin: '0 0.5rem' }}>|</span>
          <Link to="/registro" className="btn-link">Registrar usuario</Link>
        </>
      )}
    </div>
  )
}
