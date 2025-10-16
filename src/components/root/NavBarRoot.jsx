import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import logo from '../../assets/logo_pasteleria_mil_sabores.png'


export default function Header({ cartCount = 0 }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="siteHeader">
      <div className="container navBar">
        <Link to="/" aria-label="Ir al inicio" className="brand">
          <img 
            src={logo}
             alt="Logo Mil Sabores" 
             className="logo" 
             aria-hidden="true"
          />
          <span>Mil Sabores</span>
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
            <li className="accionesUsuario">
              {/* Aquí podrías agregar acciones de usuario (login/logout) */}
            </li>
          </ul>
        </nav>

        <button
          className="btnIcon"
          type="button"
          aria-label="Abrir carrito"
          onClick={() => navigate('/carrito')}
        >
          🛒 <span className="badge" aria-live="polite">{cartCount}</span>
        </button>
      </div>
    </header>
  )
}
