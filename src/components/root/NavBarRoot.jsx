import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../../assets/logo_pasteleria_mil_sabores.png'


export default function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Actualizar contador del carrito
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(totalItems)
    }

    // Actualizar al montar
    updateCartCount()

    // Escuchar cambios en localStorage
    window.addEventListener('storage', updateCartCount)
    
    // Escuchar evento personalizado para actualizar desde la misma pestaña
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <header className="siteHeader">
      <div className="container navBar">
        <Link to="/" aria-label="Ir al inicio" className="brand">
          <img 
            src={logo}
            alt="Logo Mil Sabores" 
            className="logo" 
            width="40"
            height="40"
            aria-hidden="true"
          />
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            color: 'var(--text)', 
            fontSize: '1.25rem',
            fontWeight: 700 
          }}>
            Mil Sabores
          </span>
        </Link>

        <nav className="primaryNav" aria-label="Principal">
          <ul className="menu">
            <li>
              <NavLink to="/" aria-current={({isActive}) => isActive ? 'page' : undefined}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos">Productos</NavLink>
            </li>
            <li>
              <NavLink to="/personaliza-tu-torta">Personaliza tu torta</NavLink>
            </li>
            <li>
              <NavLink to="/recetas-blogs">Recetas/Blogs</NavLink>
            </li>
            <li>
              <NavLink to="/contacto">Contacto</NavLink>
            </li>
          </ul>
        </nav>

        <button
          className="btnIcon"
          type="button"
          aria-label={`Abrir carrito (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}
          onClick={() => navigate('/carrito')}
        >
          🛒 {cartCount > 0 && <span className="badge" aria-live="polite">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
