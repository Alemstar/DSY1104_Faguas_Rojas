import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../../assets/logo_pasteleria_mil_sabores.png'
import styles from './NavBarRoot.module.css'


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
    <header className={styles.siteHeader}>
      <div className={styles.container}>
        <Link to="/" aria-label="Ir al inicio" className={styles.brand}>
          <img 
            src={logo}
             alt="Logo Mil Sabores" 
             className={styles.logo} 
             aria-hidden="true"
          />
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)', fontWeight: 700, margin: 0 }}>Mil Sabores</span>
        </Link>

        <nav className={`${styles.primaryNav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Principal">
          <ul className={styles.menu}>
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

        <div className={styles.navActions}>
          <button
            className={styles.btnIcon}
            type="button"
            aria-label={`Abrir carrito (${cartCount} ${cartCount === 1 ? 'producto' : 'productos'})`}
            onClick={() => navigate('/carrito')}
          >
            🛒 {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>
    </header>
  )
}
