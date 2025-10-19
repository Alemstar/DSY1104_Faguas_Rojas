import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: "/", label: "Home" },
  { path: "/productos", label: "Productos" },
  { path: "/personaliza-tu-torta", label: "Personaliza tu torta" },
  { path: "/recetas-blogs", label: "Recetas/Blogs" },
  { path: "/contacto", label: "Contacto" }
];

export default function FooterNav() {
  const location = useLocation();

  return (
    <div>
      <h4>Navegación</h4>
      <nav aria-label="Enlaces de pie">
        <ul className="footer-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                aria-current={location.pathname === item.path ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}