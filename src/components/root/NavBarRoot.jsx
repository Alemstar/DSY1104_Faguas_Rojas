import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCartByCustomerId } from '../../api/cart'
import logo from '../../assets/logo_pasteleria_mil_sabores.png'
import './NavBarRoot.css'


export default function Header() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Actualizar contador del carrito
  useEffect(() => {
    setIsClient(true) // Marcar que estamos en el cliente
    
    const updateCartCount = async () => {
      try {
        // Verificar si hay sesión iniciada
        const session = localStorage.getItem('sesionIniciada')
        
        if (!session) {
          setCartCount(0)
          return
        }

        const user = JSON.parse(session)
        const customerId = user.customerId || user.id

        if (!customerId) {
          setCartCount(0)
          return
        }

        // Obtener carrito del backend
        const cart = await getCartByCustomerId(customerId)
        
        if (cart && cart.items) {
          const totalItems = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
          setCartCount(totalItems)
        } else {
          setCartCount(0)
        }
      } catch (error) {
        console.error('Error al obtener contador del carrito:', error)
        setCartCount(0)
      }
    }

    // Actualizar al montar
    updateCartCount()

    // Escuchar cambios en localStorage (cierre de sesión, etc.)
    window.addEventListener('storage', updateCartCount)
    
    // Escuchar evento personalizado para actualizar desde la misma pestaña
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <header className="site-header">
      <div className="navbar-container">
        <Link to="/" aria-label="Ir al inicio" className="navbar-brand">
          <img 
            src={logo}
             alt="Logo Mil Sabores" 
             className="brand-logo" 
             aria-hidden="true"
          />
          <span className="brand-text">Mil Sabores</span>
        </Link>

        <nav className={`primary-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Principal">
          <ul className="nav-menu">
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/productos" onClick={() => setMenuOpen(false)}>Productos</NavLink>
            </li>
            <li>
              <NavLink to="/personaliza-tu-torta" onClick={() => setMenuOpen(false)}>Personaliza tu torta</NavLink>
            </li>
            <li>
              <NavLink to="/recetas-blogs" onClick={() => setMenuOpen(false)}>Recetas/Blogs</NavLink>
            </li>
            <li>
              <NavLink to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <button
            className="btn-icon"
            type="button"
            aria-label={`Abrir carrito (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}
            onClick={() => navigate('/carrito')}
          >
            🛒 {isClient && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
