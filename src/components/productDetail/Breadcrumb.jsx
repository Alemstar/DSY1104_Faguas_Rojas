import { Link } from "react-router-dom"

export default function Breadcrumb({ items }) {
  return (
    <nav style={{ padding: '1rem 3rem', fontSize: '0.9rem', color: '#666' }}>
      {items.map((item, index) => (
        <span key={index}>
          {item.path ? (
            <Link to={item.path} style={{ color: '#666', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#333' }}>{item.label}</span>
          )}
          {index < items.length - 1 && <span> {'>'} </span>}
        </span>
      ))}
    </nav>
  )
}
