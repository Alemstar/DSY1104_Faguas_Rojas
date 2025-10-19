import { Link } from "react-router-dom";
import heroImg from '../../assets/hero-pasteleria.jpg';
import SessionLinks from '../auth/SessionLinks'

export default function Hero({ message }) {
  return (
    <section className="hero-fullscreen">
      <img src={heroImg} alt="Pastelería" className="hero-bg-image" />
      <div className="hero-overlay-dark">
        <SessionLinks />
        <div className="hero-content-wrapper">
          <div className="hero-card bg-white p-4 p-md-5 rounded shadow text-center">
            <h1 className="display-4 mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
              Aniversario 50 años
            </h1>
            <p className="lead mb-4" style={{ color: 'var(--text)' }}>{message}</p>
            <Link 
              className="btn btn-lg px-5 py-3" 
              to="/productos"
              style={{ 
                backgroundColor: 'var(--accent-choco)', 
                color: 'white',
                borderRadius: '50px',
                fontWeight: '600',
                border: 'none'
              }}
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}